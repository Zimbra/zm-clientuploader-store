package com.zimbra.qa.unittest;

import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.URLEncoder;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import junit.framework.TestCase;

import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVParser;
import org.apache.commons.csv.CSVRecord;
import org.apache.commons.httpclient.HttpClient;
import org.apache.commons.httpclient.HttpState;
import org.apache.commons.httpclient.HttpStatus;
import org.apache.commons.httpclient.methods.GetMethod;
import org.junit.Test;

import com.zimbra.bp.BulkDownloadServlet;
import com.zimbra.common.httpclient.HttpClientUtil;
import com.zimbra.common.service.ServiceException;
import com.zimbra.common.soap.AdminConstants;
import com.zimbra.common.util.ZimbraHttpConnectionManager;
import com.zimbra.common.util.ZimbraLog;
import com.zimbra.cs.account.AuthToken;
import com.zimbra.cs.account.Provisioning;
import com.zimbra.cs.account.SearchDirectoryOptions;
import com.zimbra.cs.account.SearchDirectoryOptions.ObjectType;
import com.zimbra.cs.service.AuthProvider;

public class TestSearchResultsDownload extends TestCase {
    private static final String USER_PREFIX = TestSearchResultsDownload.class.getSimpleName().toLowerCase() + "_";
    private static final int NUM_ACCOUNTS = 10;

    @Override
    public void setUp() throws Exception {
        cleanup();
        for(int i = 0; i < NUM_ACCOUNTS; i++) {
            TestUtil.createAccount(USER_PREFIX + i);
        }
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
    public void testMissingTypes() throws Exception {
        AuthToken at = AuthProvider.getAdminAuthToken();
        at.setCsrfTokenEnabled(true);
        int port = 7071;
        try {
            port = Provisioning.getInstance().getLocalServer().getIntAttr(Provisioning.A_zimbraAdminPort, 0);
        } catch (ServiceException e) {
            ZimbraLog.test.error("Unable to get admin SOAP port", e);
        }
        String host =  Provisioning.getInstance().getLocalServer().getName();
        String searchDownloadURL = "https://" + host + ":" + port + "/service/extension/com_zimbra_bulkprovision/bulkdownload?action="+BulkDownloadServlet.ACTION_GETSR;
        HttpClient eve = ZimbraHttpConnectionManager.getInternalHttpConnMgr().newHttpClient();
        HttpState state = new HttpState();
        at.encode(state, true, host);
        eve.setState(state);
        GetMethod get = new GetMethod(searchDownloadURL);
        int statusCode = HttpClientUtil.executeMethod(eve, get);
        assertEquals("Should be getting status code 400. Getting status code " + statusCode, HttpStatus.SC_BAD_REQUEST,statusCode);
    }

    @Test
    public void testDownloadAllTypes() throws Exception {
        downloadCSV(new HashSet<ObjectType>(Arrays.asList(ObjectType.values())), 
                new HashSet<String>(Arrays.asList(AdminConstants.E_CALENDAR_RESOURCE,
                        AdminConstants.E_ACCOUNT,
                        AdminConstants.E_DL,
                        AdminConstants.E_ALIAS,
                        AdminConstants.E_COS,
                        AdminConstants.E_DOMAIN
                        )), null, null);
    }

    @Test
    public void testDownloadAccounts() throws Exception {
        downloadCSV(new HashSet<ObjectType>(Arrays.asList(ObjectType.accounts)),
                new HashSet<String>(Arrays.asList(AdminConstants.E_ACCOUNT)), null, null);
    }


    @Test
    public void testDownloadByQuery() throws Exception {
        List<String> expectedResults = new ArrayList<String>();
        StringBuffer sb = new StringBuffer();
        sb.append("(|");
        for (int i = 0; i < NUM_ACCOUNTS; i++) {
            sb.append("(mail=");
            sb.append(USER_PREFIX + i);
            sb.append("@");
            sb.append(TestUtil.getDomain());
            sb.append(")");
            expectedResults.add(USER_PREFIX + i + "@" + TestUtil.getDomain());
        }
        sb.append(")");
        downloadCSV(new HashSet<ObjectType>(Arrays.asList(ObjectType.accounts)),
                new HashSet<String>(Arrays.asList(AdminConstants.E_ACCOUNT,
                        AdminConstants.E_DL,
                        AdminConstants.E_ALIAS)), URLEncoder.encode(sb.toString(), "UTF-8"), expectedResults);
    }

    private void downloadCSV(Set<SearchDirectoryOptions.ObjectType> types, Set<String> typeIDs, String query, List<String> expectedResults) throws Exception {
        AuthToken at = AuthProvider.getAdminAuthToken();
        at.setCsrfTokenEnabled(true);
        int port = 7071;
        try {
            port = Provisioning.getInstance().getLocalServer().getIntAttr(Provisioning.A_zimbraAdminPort, 0);
        } catch (ServiceException e) {
            ZimbraLog.test.error("Unable to get admin SOAP port", e);
        }
        String host =  Provisioning.getInstance().getLocalServer().getName();
        String searchDownloadURL = "https://" + host + ":" + port + "/service/extension/com_zimbra_bulkprovision/bulkdownload?action="+BulkDownloadServlet.ACTION_GETSR +
                "&types="+ObjectType.toCSVString(types);
        if(query != null) {
            searchDownloadURL += "&q=" + query;
        }
        HttpClient eve = ZimbraHttpConnectionManager.getInternalHttpConnMgr().newHttpClient();
        HttpState state = new HttpState();
        at.encode(state, true, host);
        eve.setState(state);
        GetMethod get = new GetMethod(searchDownloadURL);
        int statusCode = HttpClientUtil.executeMethod(eve, get);
        assertEquals("The GET request should succeed. Getting status code " + statusCode, HttpStatus.SC_OK,statusCode);
        CSVParser parser = null;
        InputStream in = null;
        try {
            in = get.getResponseBodyAsStream();
            parser = new CSVParser(new InputStreamReader(in), CSVFormat.DEFAULT);
            List<CSVRecord> records = parser.getRecords();
            assertNotNull("Result set should not be NULL", records);
            assertFalse("Result set should not be empty", records.isEmpty());
            int numFound = 0;
            assertTrue("Result set should have more than one entry", records.size() > 1);
            for(CSVRecord record : records) {
                assertTrue("each record should have at least 3 fields", record.size() > 2);
                String name = record.get(0);
                assertNotNull("1st field should not be NULL", name);
                assertNotNull("2d field should not be NULL", record.get(1));
                String val = record.get(2);
                assertNotNull("3rd field should not be NULL", val);
                assertTrue("Record has invalid type " + val, typeIDs.contains(val));
                if(expectedResults != null) {
                    assertTrue("Unexpected record in result set: " + name, expectedResults.contains(name));
                    numFound++;
                }
            }
            if(expectedResults != null) {
                assertEquals("Unexpected number of results in record set", expectedResults.size(), numFound);
            }
        } finally  {
            try {
                if(parser != null) {
                    parser.close();
                }
                if(in != null) {
                    in.close();
                }
            } catch (IOException e) {
                //ignore
            }
        }
    }
}
