package com.zimbra.qa.unittest;

import static org.junit.Assert.*;
import junit.framework.TestCase;

import org.apache.commons.httpclient.HttpClient;
import org.apache.commons.httpclient.HttpState;
import org.apache.commons.httpclient.HttpStatus;
import org.apache.commons.httpclient.cookie.CookiePolicy;
import org.apache.commons.httpclient.methods.PostMethod;
import org.apache.commons.httpclient.methods.multipart.ByteArrayPartSource;
import org.apache.commons.httpclient.methods.multipart.FilePart;
import org.apache.commons.httpclient.methods.multipart.MultipartRequestEntity;
import org.apache.commons.httpclient.methods.multipart.Part;
import org.apache.commons.httpclient.methods.multipart.StringPart;
import org.junit.Test;

import com.zimbra.common.httpclient.HttpClientUtil;
import com.zimbra.common.localconfig.LC;
import com.zimbra.common.service.ServiceException;
import com.zimbra.common.soap.Element;
import com.zimbra.common.soap.SoapHttpTransport;
import com.zimbra.common.soap.SoapProtocol;
import com.zimbra.common.util.Constants;
import com.zimbra.common.util.ZimbraCookie;
import com.zimbra.common.util.ZimbraHttpConnectionManager;
import com.zimbra.common.util.ZimbraLog;
import com.zimbra.cs.account.AuthToken;
import com.zimbra.cs.account.Provisioning;
import com.zimbra.cs.service.AuthProvider;
import com.zimbra.soap.JaxbUtil;

public class TestClientUploader {
    private static String HANDLER_URL = "/service/extension/clientUploader/upload/";
    private static String FILE_NAME = "zco.exe";
    private static String RESP_STR = "window.parent._uploadManager.loaded";

    @Test
    public void testUploadNoCsrf() throws Exception {
        AuthToken at = AuthProvider.getAdminAuthToken();
        at.setCsrfTokenEnabled(false);
        int port = 7071;
        try {
            port = Provisioning.getInstance().getLocalServer().getIntAttr(Provisioning.A_zimbraAdminPort, 0);
        } catch (ServiceException e) {
            ZimbraLog.test.error("Unable to get admin SOAP port", e);
        }
        String Url = "https://localhost:" + port + HANDLER_URL;
        PostMethod post = new PostMethod(Url);
        FilePart part = new FilePart(FILE_NAME, new ByteArrayPartSource(FILE_NAME, "some file content".getBytes()));
        String contentType = "application/x-msdownload";
        part.setContentType(contentType);
        HttpClient client = ZimbraHttpConnectionManager.getInternalHttpConnMgr().newHttpClient();
        HttpState state = new HttpState();
        at.encode(state, true, "localhost");
        client.setState(state);
        post.setRequestEntity(new MultipartRequestEntity(new Part[] { part }, post.getParams()));
        int statusCode = HttpClientUtil.executeMethod(client, post);
        assertEquals("This request should succeed. Getting status code " + statusCode, HttpStatus.SC_OK, statusCode);
        String resp = post.getResponseBodyAsString();
        assertNotNull("Response should not be empty", resp);
        assertTrue("Incorrect HTML response", resp.contains(RESP_STR));
    }

    @Test
    public void testUploadWithCsrfInHeader() throws Exception {
        SoapHttpTransport transport = new SoapHttpTransport(TestUtil.getAdminSoapUrl());
        com.zimbra.soap.admin.message.AuthRequest req = new com.zimbra.soap.admin.message.AuthRequest(
                LC.zimbra_ldap_user.value(), LC.zimbra_ldap_password.value());
        req.setCsrfSupported(true);
        Element response = transport.invoke(JaxbUtil.jaxbToElement(req, SoapProtocol.SoapJS.getFactory()));
        com.zimbra.soap.admin.message.AuthResponse authResp = JaxbUtil.elementToJaxb(response);
        String authToken = authResp.getAuthToken();
        String csrfToken = authResp.getCsrfToken();
        int port = 7071;
        try {
            port = Provisioning.getInstance().getLocalServer().getIntAttr(Provisioning.A_zimbraAdminPort, 0);
        } catch (ServiceException e) {
            ZimbraLog.test.error("Unable to get admin SOAP port", e);
        }
        String Url = "https://localhost:" + port + HANDLER_URL;
        PostMethod post = new PostMethod(Url);
        FilePart part = new FilePart(FILE_NAME, new ByteArrayPartSource(FILE_NAME, "some file content".getBytes()));
        String contentType = "application/x-msdownload";
        part.setContentType(contentType);
        HttpClient client = ZimbraHttpConnectionManager.getInternalHttpConnMgr().newHttpClient();
        HttpState state = new HttpState();
        state.addCookie(new org.apache.commons.httpclient.Cookie("localhost", ZimbraCookie.authTokenCookieName(true),
                authToken, "/", null, false));
        client.getParams().setCookiePolicy(CookiePolicy.BROWSER_COMPATIBILITY);
        client.setState(state);
        post.setRequestEntity(new MultipartRequestEntity(new Part[] { part }, post.getParams()));
        post.addRequestHeader(Constants.CSRF_TOKEN, csrfToken);
        int statusCode = HttpClientUtil.executeMethod(client, post);
        assertEquals("This request should succeed. Getting status code " + statusCode, HttpStatus.SC_OK, statusCode);
        String resp = post.getResponseBodyAsString();
        assertNotNull("Response should not be empty", resp);
        assertTrue("Incorrect HTML response", resp.contains(RESP_STR));
    }

    @Test
    public void testMissingCsrfUpload() throws Exception {
        SoapHttpTransport transport = new SoapHttpTransport(TestUtil.getAdminSoapUrl());
        com.zimbra.soap.admin.message.AuthRequest req = new com.zimbra.soap.admin.message.AuthRequest(
                LC.zimbra_ldap_user.value(), LC.zimbra_ldap_password.value());
        req.setCsrfSupported(true);
        Element response = transport.invoke(JaxbUtil.jaxbToElement(req, SoapProtocol.SoapJS.getFactory()));
        com.zimbra.soap.admin.message.AuthResponse authResp = JaxbUtil.elementToJaxb(response);
        String authToken = authResp.getAuthToken();
        int port = 7071;
        try {
            port = Provisioning.getInstance().getLocalServer().getIntAttr(Provisioning.A_zimbraAdminPort, 0);
        } catch (ServiceException e) {
            ZimbraLog.test.error("Unable to get admin SOAP port", e);
        }
        String Url = "https://localhost:" + port + HANDLER_URL;
        PostMethod post = new PostMethod(Url);
        FilePart part = new FilePart(FILE_NAME, new ByteArrayPartSource(FILE_NAME, "some file content".getBytes()));
        String contentType = "application/x-msdownload";
        part.setContentType(contentType);
        HttpClient client = ZimbraHttpConnectionManager.getInternalHttpConnMgr().newHttpClient();
        HttpState state = new HttpState();
        state.addCookie(new org.apache.commons.httpclient.Cookie("localhost", ZimbraCookie.authTokenCookieName(true),
                authToken, "/", null, false));
        client.getParams().setCookiePolicy(CookiePolicy.BROWSER_COMPATIBILITY);
        client.setState(state);
        post.setRequestEntity(new MultipartRequestEntity(new Part[] { part }, post.getParams()));
        int statusCode = HttpClientUtil.executeMethod(client, post);
        assertEquals("This request should succeed. Getting status code " + statusCode, HttpStatus.SC_OK, statusCode);
        String resp = post.getResponseBodyAsString();
        assertNotNull("Response should not be empty", resp);
        assertTrue("Incorrect HTML response", resp.contains(RESP_STR));
    }

    @Test
    public void testUploadWithCsrfInFormField() throws Exception {
        SoapHttpTransport transport = new SoapHttpTransport(TestUtil.getAdminSoapUrl());
        com.zimbra.soap.admin.message.AuthRequest req = new com.zimbra.soap.admin.message.AuthRequest(
                LC.zimbra_ldap_user.value(), LC.zimbra_ldap_password.value());
        req.setCsrfSupported(true);
        Element response = transport.invoke(JaxbUtil.jaxbToElement(req, SoapProtocol.SoapJS.getFactory()));
        com.zimbra.soap.admin.message.AuthResponse authResp = JaxbUtil.elementToJaxb(response);
        String authToken = authResp.getAuthToken();
        String csrfToken = authResp.getCsrfToken();
        int port = 7071;
        try {
            port = Provisioning.getInstance().getLocalServer().getIntAttr(Provisioning.A_zimbraAdminPort, 0);
        } catch (ServiceException e) {
            ZimbraLog.test.error("Unable to get admin SOAP port", e);
        }
        String Url = "https://localhost:" + port + HANDLER_URL;
        PostMethod post = new PostMethod(Url);
        FilePart part = new FilePart(FILE_NAME, new ByteArrayPartSource(FILE_NAME, "some file content".getBytes()));
        Part csrfPart = new StringPart("csrfToken", csrfToken);
        String contentType = "application/x-msdownload";
        part.setContentType(contentType);
        HttpClient client = ZimbraHttpConnectionManager.getInternalHttpConnMgr().newHttpClient();
        HttpState state = new HttpState();
        state.addCookie(new org.apache.commons.httpclient.Cookie("localhost", ZimbraCookie.authTokenCookieName(true),
                authToken, "/", null, false));
        client.getParams().setCookiePolicy(CookiePolicy.BROWSER_COMPATIBILITY);
        client.setState(state);
        post.setRequestEntity(new MultipartRequestEntity(new Part[] { part, csrfPart }, post.getParams()));
        int statusCode = HttpClientUtil.executeMethod(client, post);
        assertEquals("This request should succeed. Getting status code " + statusCode, HttpStatus.SC_OK, statusCode);
        String resp = post.getResponseBodyAsString();
        assertNotNull("Response should not be empty", resp);
        assertTrue("Incorrect HTML response", resp.contains(RESP_STR));
    }
}
