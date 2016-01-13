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

import junit.framework.TestCase;

import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVParser;
import org.apache.commons.csv.CSVRecord;
import org.apache.commons.httpclient.HttpClient;
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

import com.zimbra.bp.BulkProvisioningThread;
import com.zimbra.common.httpclient.HttpClientUtil;
import com.zimbra.common.service.ServiceException;
import com.zimbra.common.soap.AdminConstants;
import com.zimbra.common.soap.AdminExtConstants;
import com.zimbra.common.soap.Element;
import com.zimbra.common.soap.SoapProtocol;
import com.zimbra.common.soap.SoapTransport;
import com.zimbra.common.util.ZimbraHttpConnectionManager;
import com.zimbra.common.util.ZimbraLog;
import com.zimbra.cs.account.AuthToken;
import com.zimbra.cs.account.Provisioning;
import com.zimbra.cs.service.AuthProvider;
import com.zimbra.soap.JaxbUtil;

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
        //generate provisioning XML
        XMLWriter xw = null;
        StringWriter stringWriter = new StringWriter();
        CSVParser parser = null;
        InputStream in = null;
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
            String xmlContent = stringWriter.toString();
            
            AuthToken at = AuthProvider.getAdminAuthToken();
            at.setCsrfTokenEnabled(true);
            int port = 7071;
            try {
                port = Provisioning.getInstance().getLocalServer().getIntAttr(Provisioning.A_zimbraAdminPort, 0);
            } catch (ServiceException e) {
                ZimbraLog.test.error("Unable to get admin SOAP port", e);
            }
            String host =  Provisioning.getInstance().getLocalServer().getName();
            String uploadURL = "https://" + host + ":" + port + "/service/upload";
            HttpClient eve = ZimbraHttpConnectionManager.getInternalHttpConnMgr().newHttpClient();
            HttpState state = new HttpState();
            at.encode(state, true, host);
            eve.setState(state);
            List<Part> parts = new ArrayList<Part>();
            parts.add(new StringPart("requestId", "0"));
            parts.add(createAttachmentPart("bulkFile_" + USER_PREFIX + ".xml", xmlContent.getBytes()));

            //upload the XML file
            PostMethod post = new PostMethod(uploadURL);
            post.setRequestEntity(new MultipartRequestEntity(parts.toArray(new Part[parts.size()]), post.getParams()));
            int statusCode = HttpClientUtil.executeMethod(eve, post);
            assertEquals("Should be getting status code 200 for upload. Getting status code " + statusCode, HttpStatus.SC_OK,statusCode);

            //check that it was parsed
            String uploadResp = post.getResponseBodyAsString();
            Pattern pattern = Pattern.compile("([a-z0-9\\-]+)(:)([a-z0-9\\-]+)");
            Matcher matcher = pattern.matcher(uploadResp);
            String uploadId = null;
            if (matcher.find()) {
                uploadId = matcher.group(0);
            }
            assertNotNull("could not find uploadID in response " + uploadResp, uploadId);
            com.zimbra.soap.adminext.message.BulkImportAccountsRequest bulkImportRequest = new com.zimbra.soap.adminext.message.BulkImportAccountsRequest();
            bulkImportRequest.setAttachmentID(uploadId);
            bulkImportRequest.setCreateDomains("FALSE");
            bulkImportRequest.setSourceType("bulkxml");
            bulkImportRequest.setOp("preview");
            SoapTransport transport = TestUtil.getAdminSoapTransport();
            Element respElement = transport.invoke(JaxbUtil.jaxbToElement(bulkImportRequest, SoapProtocol.SoapJS.getFactory()));
            assertNotNull("SOAP Response should not be null", respElement);
            com.zimbra.soap.adminext.message.BulkImportAccountsResponse resp = JaxbUtil.elementToJaxb(respElement);
            assertNotNull("BulkImportAccountsResponse should not be null", resp);
            assertNotNull("totalCount should not be null", resp.getTotalCount());
            assertEquals("total count should be equal to the number of accounts in the uploaded XML", NUM_ACCOUNTS, resp.getTotalCount().intValue());

            bulkImportRequest = new com.zimbra.soap.adminext.message.BulkImportAccountsRequest();
            bulkImportRequest.setAttachmentID(uploadId);
            bulkImportRequest.setCreateDomains("FALSE");
            bulkImportRequest.setSourceType("bulkxml");
            bulkImportRequest.setOp("startImport");
            resp = JaxbUtil.elementToJaxb(transport.invoke(JaxbUtil.jaxbToElement(bulkImportRequest)));
            assertNotNull("BulkImportAccountsResponse should not be null", resp);
            Integer status = 0;
            String fileID = null;
            for(int i = 0; i < 10; i++) {
                Thread.sleep(10000);
                bulkImportRequest = new com.zimbra.soap.adminext.message.BulkImportAccountsRequest();
                bulkImportRequest.setAttachmentID(uploadId);
                bulkImportRequest.setCreateDomains("FALSE");
                bulkImportRequest.setSourceType("bulkxml");
                bulkImportRequest.setOp("getStatus");
                resp = JaxbUtil.elementToJaxb(transport.invoke(JaxbUtil.jaxbToElement(bulkImportRequest)));
                status = resp.getStatus();
                assertNotNull("import status should not be null", status);
                if(status > BulkProvisioningThread.iSTATUS_CREATING_ACCOUNTS || status == BulkProvisioningThread.iSTATUS_IDLE) {
                    if(status == BulkProvisioningThread.iSTATUS_FINISHED) {
                        fileID = resp.getReportFileToken();
                        assertNotNull("report file token should not be null", fileID);
                    }
                    break;
                }
                assertNotNull("BulkImportAccountsResponse should not be null", resp);
            }
            assertEquals("Status should be '4' (finished)", BulkProvisioningThread.iSTATUS_FINISHED, status.intValue());

            String bulkDownloadURL = "https://" + host + ":" + port + 
                    "/service/extension/com_zimbra_bulkprovision/bulkdownload?action=getBulkFile&fileFormat=reportcsv&fileID=" + fileID;

            GetMethod get = new GetMethod(bulkDownloadURL);
            statusCode = HttpClientUtil.executeMethod(eve, get);
            assertEquals("The GET request should succeed. Getting status code " + statusCode, HttpStatus.SC_OK,statusCode);
            in = get.getResponseBodyAsStream();
            parser = new CSVParser(new InputStreamReader(in), CSVFormat.DEFAULT);
            List<CSVRecord> records = parser.getRecords();
            assertNotNull("Result set should not be NULL", records);
            assertFalse("Result set should not be empty", records.isEmpty());
            assertEquals("Result set should have " + NUM_ACCOUNTS + " entries", NUM_ACCOUNTS, records.size());
            for(CSVRecord record : records) {
                assertTrue("each record should have at least 2 fields. Getting only " + record.size(), record.size() > 1);
                String name = record.get(0);
                assertNotNull("1st field should not be NULL", name);
                assertNotNull("2d field should not be NULL", record.get(1));
                assertTrue("Unexpected record in result set: " + name, name.indexOf(USER_PREFIX) > -1);
            }
        } finally {
            if (xw != null) {
                try {
                    xw.close();
                } catch (IOException ignore) {
                    //ignore
                }
            }
            if (stringWriter != null) {
                try {
                    stringWriter.close();
                } catch (IOException ignore) {
                    //ignore
                }
            }
            try {
                if(parser != null) {
                    parser.close();
                }
                if(in != null) {
                    in.close();
                }
            } catch (IOException ignore) {
                //ignore
            }
        }
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
