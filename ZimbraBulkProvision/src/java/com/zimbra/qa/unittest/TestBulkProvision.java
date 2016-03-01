package com.zimbra.qa.unittest;

import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.StringWriter;
import java.net.URLConnection;
import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVParser;
import org.apache.commons.csv.CSVRecord;
import org.apache.commons.httpclient.HttpClient;
import org.apache.commons.httpclient.HttpException;
import org.apache.commons.httpclient.HttpState;
import org.apache.commons.httpclient.HttpStatus;
import org.apache.commons.httpclient.methods.GetMethod;
import org.apache.commons.httpclient.methods.PostMethod;
import org.apache.commons.httpclient.methods.multipart.ByteArrayPartSource;
import org.apache.commons.httpclient.methods.multipart.FilePart;
import org.apache.commons.httpclient.methods.multipart.MultipartRequestEntity;
import org.apache.commons.httpclient.methods.multipart.Part;
import org.apache.commons.httpclient.methods.multipart.StringPart;
import org.dom4j.Document;
import org.dom4j.DocumentHelper;
import org.dom4j.io.XMLWriter;
import org.junit.Test;

import com.google.common.io.Closeables;
import com.zimbra.bp.BulkProvisioningThread;
import com.zimbra.common.httpclient.HttpClientUtil;
import com.zimbra.common.service.ServiceException;
import com.zimbra.common.soap.AdminExtConstants;
import com.zimbra.common.soap.Element;
import com.zimbra.common.soap.SoapFaultException;
import com.zimbra.common.soap.SoapProtocol;
import com.zimbra.common.soap.SoapTransport;
import com.zimbra.common.util.ZimbraHttpConnectionManager;
import com.zimbra.common.util.ZimbraLog;
import com.zimbra.cs.account.AuthToken;
import com.zimbra.cs.account.Provisioning;
import com.zimbra.cs.service.AuthProvider;
import com.zimbra.soap.JaxbUtil;
import com.zimbra.soap.admin.message.GetAccountRequest;
import com.zimbra.soap.admin.message.GetAccountResponse;
import com.zimbra.soap.admin.type.Attr;
import com.zimbra.soap.adminext.message.BulkImportAccountsRequest;
import com.zimbra.soap.adminext.message.BulkImportAccountsResponse;
import com.zimbra.soap.type.AccountSelector;

import junit.framework.TestCase;

public class TestBulkProvision extends TestCase {
    private static final String USER_PREFIX = TestBulkProvision.class.getSimpleName().toLowerCase() + "_";
    private static final int NUM_ACCOUNTS = 10;

    @Override
    public void setUp() throws Exception {
        cleanup();
    }

    @Override
    public void tearDown() throws Exception {
        cleanup();
    }

    private void cleanup() throws Exception {
        for(int i = 0; i < NUM_ACCOUNTS; i++) {
            if(TestUtil.accountExists(USER_PREFIX + i)) {
                TestUtil.deleteAccount(USER_PREFIX + i);
            }
        }
    }

    @Test
    public void testProvisionViaXML() throws Exception {
        String xmlContent = generateProvisioningXML();
        String host =  Provisioning.getInstance().getLocalServer().getName();
        int port = getAdminPort();
        AuthToken at = AuthProvider.getAdminAuthToken();
        at.setCsrfTokenEnabled(true);
        HttpClient eve = getHttpClient(at, host);
        String uploadId = uploadAndGetUploadId(host, port, eve, "bulkFile_" + USER_PREFIX + ".xml", xmlContent);
        BulkImportAccountsRequest bulkImportRequest = new BulkImportAccountsRequest();
        bulkImportRequest.setAttachmentID(uploadId);
        bulkImportRequest.setCreateDomains("FALSE");
        bulkImportRequest.setSourceType("bulkxml");
        bulkImportRequest.setOp("preview");
        SoapTransport transport = TestUtil.getAdminSoapTransport();
        Element respElement = transport.invoke(
                JaxbUtil.jaxbToElement(bulkImportRequest, SoapProtocol.SoapJS.getFactory()));
        assertNotNull("SOAP Response should not be null", respElement);
        BulkImportAccountsResponse resp = JaxbUtil.elementToJaxb(respElement);
        assertNotNull("BulkImportAccountsResponse should not be null", resp);
        assertNotNull("totalCount should not be null", resp.getTotalCount());
        assertEquals("total count should be equal to the number of accounts in the uploaded XML",
                NUM_ACCOUNTS, resp.getTotalCount().intValue());

        bulkImportRequest.setOp("startImport");
        resp = JaxbUtil.elementToJaxb(transport.invoke(JaxbUtil.jaxbToElement(bulkImportRequest)));
        assertNotNull("BulkImportAccountsResponse should not be null", resp);
        bulkImportRequest.setOp("getStatus");
        String fileID = waitForBulkImportFinish(bulkImportRequest, transport);
        validateReportCSV(fileID, NUM_ACCOUNTS, host, port, eve);
    }

    @Test
    public void testProvisionViaXMLWithEntity() throws Exception {
        String xmlContent = generateProvisioningXMLWithEntity();
        String host =  Provisioning.getInstance().getLocalServer().getName();
        int port = getAdminPort();
        AuthToken at = AuthProvider.getAdminAuthToken();
        at.setCsrfTokenEnabled(true);
        HttpClient eve = getHttpClient(at, host);
        String uploadId = uploadAndGetUploadId(host, port, eve, "bulkFile_" + USER_PREFIX + "EN.xml", xmlContent);
        BulkImportAccountsRequest bulkImportRequest = new BulkImportAccountsRequest();
        bulkImportRequest.setAttachmentID(uploadId);
        bulkImportRequest.setCreateDomains("FALSE");
        bulkImportRequest.setSourceType("bulkxml");
        bulkImportRequest.setOp("startImport");
        SoapTransport transport = TestUtil.getAdminSoapTransport();
        try {
            BulkImportAccountsResponse resp =
                    JaxbUtil.elementToJaxb(transport.invoke(JaxbUtil.jaxbToElement(bulkImportRequest)));
            fail("Should have failed because we don't allow 'DOCTYPE' in XML");
            // Rest of code kept as useful to see what happens when not using safe XML processing.
            assertNotNull("BulkImportAccountsResponse should not be null", resp);
            bulkImportRequest.setOp("getStatus");
            String fileID = waitForBulkImportFinish(bulkImportRequest, transport);
            validateReportCSV(fileID, 1, host, port, eve);
            String email = USER_PREFIX + 0 + "@" + TestUtil.getDomain();
            GetAccountRequest getAccountReq = new GetAccountRequest(AccountSelector.fromName(email));
            getAccountReq.addAttrs(Provisioning.A_displayName);
            GetAccountResponse getAccountResp = JaxbUtil.elementToJaxb(
                    transport.invoke(JaxbUtil.jaxbToElement(getAccountReq)));
            assertNotNull("GetAccountResponse", getAccountResp);
            List<Attr> respAttrs = getAccountResp.getAccount().getAttrList();
            assertNotNull("GetAccount response attributes", respAttrs);
            assertEquals("number of GetAccount response attributes", 1, respAttrs.size());
            Attr attr = respAttrs.get(0);
            assertEquals("Name of GetAccount response attribute", Provisioning.A_displayName, attr.getKey());
            // Should NOT contain the contents of /etc/hosts
            assertEquals("Value of displayName GetAccount response attribute",
                    USER_PREFIX + 0 + "display", attr.getValue());
        } catch (SoapFaultException sfe) {
            // This is the expected fault for any problem reading the XML of the upload.
            // In this case, it is because the XML uses DOCTYPE
            String sfeMsg = "system failure: Bulk provisioning failed to read uploaded XML document.";
            assertTrue(String.format("SoapFaultException for %s should have been caught", sfeMsg),
                    sfe.getMessage().contains(sfeMsg));
        }
    }

    private static String provisioningXMLWithEntityTemplate =
            "<!DOCTYPE foo [ \n" +
            "   <!ELEMENT foo ANY >\n" +
            "   <!ENTITY xxe SYSTEM \"file:///etc/hosts\" >]>\n" +
            "<ZCSImport>\n" +
            "  <ImportUsers>\n" +
            "    <User>\n" +
            "      <sn>#SN#</sn>\n" +
            "      <givenName>#GN#</givenName>\n" +
            "      <displayName>#DN#&xxe;</displayName>\n" +
            "      <RemoteEmailAddress>#REA#</RemoteEmailAddress>\n" +
            "      <password>test12345</password>\n" +
            "      <zimbraPasswordMustChange>TRUE</zimbraPasswordMustChange>\n" +
            "    </User>\n" +
            "  </ImportUsers>\n" +
            "</ZCSImport>\n";

    public static String generateProvisioningXMLWithEntity() throws Exception {
        return provisioningXMLWithEntityTemplate
                .replaceAll("#SN#", USER_PREFIX + 0 + "lastname")
                .replaceAll("#GN#", USER_PREFIX + 0)
                .replaceAll("#DN#", USER_PREFIX + 0 + "display")
                .replaceAll("#REA#", USER_PREFIX + 0 + "@" + TestUtil.getDomain());
    }

    public static String generateProvisioningXML() throws Exception {
        XMLWriter xw = null;
        StringWriter stringWriter = new StringWriter();
        try {
            xw = new XMLWriter(stringWriter, org.dom4j.io.OutputFormat.createPrettyPrint());
            Document doc = DocumentHelper.createDocument();
            org.dom4j.Element rootEl = DocumentHelper.createElement(AdminExtConstants.E_ZCSImport);
            org.dom4j.Element usersEl = DocumentHelper.createElement(AdminExtConstants.E_ImportUsers);
            doc.add(rootEl);
            rootEl.add(usersEl);
            for(int i = 0; i < NUM_ACCOUNTS; i++) {
                String email = USER_PREFIX + i + "@" + TestUtil.getDomain();
                org.dom4j.Element eUser = DocumentHelper.createElement(AdminExtConstants.E_User);
                org.dom4j.Element eName = DocumentHelper.createElement(AdminExtConstants.E_remoteEmail);
                eName.setText(email);
                eUser.add(eName);

                org.dom4j.Element eDisplayName = DocumentHelper.createElement(Provisioning.A_displayName);
                eDisplayName.setText(USER_PREFIX + i);
                eUser.add(eDisplayName);

                org.dom4j.Element eGivenName = DocumentHelper.createElement(Provisioning.A_givenName);
                eGivenName.setText(USER_PREFIX + i);
                eUser.add(eGivenName);

                org.dom4j.Element eLastName = DocumentHelper.createElement(Provisioning.A_sn);
                eLastName.setText(USER_PREFIX + i + "lastname");
                eUser.add(eLastName);

                org.dom4j.Element ePassword = DocumentHelper.createElement(AdminExtConstants.A_password);
                ePassword.setText("test12345");
                eUser.add(ePassword);

                usersEl.add(eUser);
            }
            xw.write(doc);
            xw.flush();
            return stringWriter.toString();
        } finally {
            if (xw != null) {
                try {
                    xw.close();
                } catch (IOException ignore) {
                    //ignore
                }
            }
            Closeables.closeQuietly(stringWriter);
        }
    }

    private static void validateReportCSV(String fileID, int expected, String host, int port, HttpClient eve)
    throws HttpException, IOException {
        String bulkDownloadURL = "https://" + host + ":" + port +
            "/service/extension/com_zimbra_bulkprovision/bulkdownload?action=getBulkFile&fileFormat=reportcsv&fileID=" +
            fileID;

        GetMethod get = new GetMethod(bulkDownloadURL);
        int statusCode = HttpClientUtil.executeMethod(eve, get);
        assertEquals("The GET request should succeed. Getting status code " + statusCode, HttpStatus.SC_OK,statusCode);
        try (InputStream in = get.getResponseBodyAsStream();
                CSVParser parser = new CSVParser(new InputStreamReader(in), CSVFormat.DEFAULT)) {
            List<CSVRecord> records = parser.getRecords();
            assertNotNull("Result set should not be NULL", records);
            assertFalse("Result set should not be empty", records.isEmpty());
            assertEquals("Result set should have " + expected + " entries", expected, records.size());
            for(CSVRecord record : records) {
                ZimbraLog.test.debug("CSV Record '%s'", record);
                assertTrue("each record should have at least 2 fields. Getting only " + record.size(),
                        record.size() > 1);
                String name = record.get(0);
                assertNotNull("1st field should not be NULL", name);
                assertNotNull("2nd field should not be NULL", record.get(1));
                assertTrue("Unexpected record in result set: " + name, name.indexOf(USER_PREFIX) > -1);
            }
        };
    }

    public static int getAdminPort() {
        int port = 7071;
        try {
            port = Provisioning.getInstance().getLocalServer().getIntAttr(Provisioning.A_zimbraAdminPort, 0);
        } catch (ServiceException e) {
            ZimbraLog.test.error("Unable to get admin SOAP port", e);
        }
        return port;
    }

    public static HttpClient getHttpClient(AuthToken at, String host) throws ServiceException {
        HttpClient eve = ZimbraHttpConnectionManager.getInternalHttpConnMgr().newHttpClient();
        HttpState state = new HttpState();
        at.encode(state, true, host);
        eve.setState(state);
        return eve;
    }

    private static String waitForBulkImportFinish(BulkImportAccountsRequest bulkImportRequest, SoapTransport transport)
    throws ServiceException, IOException {
        BulkImportAccountsResponse resp;
        Integer status = -1;
        String reportFileToken = null;
        for(int i = 0; i < 10; i++) {
            try {
                Thread.sleep(10000);
            } catch (InterruptedException e) {
            }
            Element respElem = transport.invoke(JaxbUtil.jaxbToElement(bulkImportRequest));
            resp = JaxbUtil.elementToJaxb(respElem);
            assertNotNull("BulkImportAccountsResponse should not be null", resp);
            status = resp.getStatus();
            assertNotNull("import status should not be null", status);
            if  (   status > BulkProvisioningThread.iSTATUS_CREATING_ACCOUNTS ||
                    status == BulkProvisioningThread.iSTATUS_IDLE) {
                if(status == BulkProvisioningThread.iSTATUS_FINISHED) {
                    reportFileToken = resp.getReportFileToken();
                    assertNotNull(String.format("report file token should not be null in \n%s\n", respElem),
                            reportFileToken);
                }
                break;
            }
        }
        assertEquals("Status should be '4' (finished)", BulkProvisioningThread.iSTATUS_FINISHED, status.intValue());
        return reportFileToken;
    }

    public static String uploadAndGetUploadId(String host, int port, HttpClient eve, String fileName, String content)
    throws ServiceException, HttpException, IOException {
        String uploadURL = "https://" + host + ":" + port + "/service/upload";
        List<Part> parts = new ArrayList<Part>();
        parts.add(new StringPart("requestId", "0"));
        parts.add(createAttachmentPart(fileName, content.getBytes()));

        //upload the XML file
        PostMethod post = new PostMethod(uploadURL);
        post.setRequestEntity(new MultipartRequestEntity(parts.toArray(new Part[parts.size()]), post.getParams()));
        int statusCode = HttpClientUtil.executeMethod(eve, post);
        assertEquals("Should be getting status code 200 (OK) for upload" , HttpStatus.SC_OK, statusCode);

        //check that it was parsed
        String uploadResp = post.getResponseBodyAsString();
        Pattern pattern = Pattern.compile("([a-z0-9\\-]+)(:)([a-z0-9\\-]+)");
        Matcher matcher = pattern.matcher(uploadResp);
        String uploadId = null;
        if (matcher.find()) {
            uploadId = matcher.group(0);
        }
        assertNotNull("could not find uploadID in response " + uploadResp, uploadId);
        return uploadId;
    }

    /**
     * Creates an <tt>HttpClient FilePart</tt> from the given filename and content.
     */
    public static FilePart createAttachmentPart(String filename, byte[] content) {
        FilePart part = new FilePart(filename, new ByteArrayPartSource(filename, content));
        String contentType = URLConnection.getFileNameMap().getContentTypeFor(filename);
        part.setContentType(contentType);
        return part;
    }
}
