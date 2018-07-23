/*
 * ***** BEGIN LICENSE BLOCK *****
 *
 * Zimbra Collaboration Suite Server
 * Copyright (C) 2016 Synacor, Inc.
 *
 * This program is free software: you can redistribute it and/or modify it under
 * the terms of the GNU General Public License as published by the Free Software Foundation,
 * version 2 of the License.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY;
 * without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
 * See the GNU General Public License for more details.
 * You should have received a copy of the GNU General Public License along with this program.
 * If not, see <https://www.gnu.org/licenses/>.
 *
 * ***** END LICENSE BLOCK *****
 */
package com.zimbra.qa.unittest;

import junit.framework.TestCase;

import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.HttpStatus;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.ContentType;
import org.apache.http.entity.mime.MultipartEntityBuilder;
import org.apache.http.impl.client.BasicCookieStore;
import org.apache.http.impl.client.HttpClientBuilder;
import org.apache.http.impl.cookie.BasicClientCookie;
import org.junit.Test;

import com.zimbra.common.httpclient.HttpClientUtil;
import com.zimbra.common.localconfig.LC;
import com.zimbra.common.service.ServiceException;
import com.zimbra.common.soap.Element;
import com.zimbra.common.soap.SoapHttpTransport;
import com.zimbra.common.soap.SoapProtocol;
import com.zimbra.common.util.ByteUtil;
import com.zimbra.common.util.Constants;
import com.zimbra.common.util.ZimbraCookie;
import com.zimbra.common.util.ZimbraHttpConnectionManager;
import com.zimbra.common.util.ZimbraLog;
import com.zimbra.cs.account.AuthToken;
import com.zimbra.cs.account.Provisioning;
import com.zimbra.cs.service.AuthProvider;
import com.zimbra.soap.JaxbUtil;

public class TestClientUploader extends TestCase {
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
        HttpPost post = new HttpPost(Url);
        MultipartEntityBuilder builder = MultipartEntityBuilder.create();
        builder.addBinaryBody(FILE_NAME, "some file content".getBytes(), ContentType.DEFAULT_BINARY, FILE_NAME);
        HttpEntity entity = builder.build();
        post.setEntity(entity);
        String contentType = "application/x-msdownload";
        post.addHeader("Content-type", contentType);
        BasicCookieStore state = new BasicCookieStore();
        at.encode(state, true, "localhost");

        HttpClientBuilder client = ZimbraHttpConnectionManager.getInternalHttpConnMgr().newHttpClient();
        client.setDefaultCookieStore(state);

        HttpResponse response = HttpClientUtil.executeMethod(client.build(), post);

        int statusCode = response.getStatusLine().getStatusCode();
        assertEquals("This request should succeed. Getting status code " + statusCode, HttpStatus.SC_OK, statusCode);
        String resp = new String(ByteUtil.getContent(response.getEntity().getContent(), -1));
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
        HttpPost post = new HttpPost(Url);

        MultipartEntityBuilder builder = MultipartEntityBuilder.create();
        builder.addBinaryBody(FILE_NAME, "some file content".getBytes(), ContentType.DEFAULT_BINARY, FILE_NAME);
        HttpEntity entity = builder.build();
        post.setEntity(entity);

        String contentType = "application/x-msdownload";
        post.addHeader("Content-type", contentType);

        BasicCookieStore state = new BasicCookieStore();
        BasicClientCookie cookie = new BasicClientCookie(ZimbraCookie.authTokenCookieName(true), authToken);
        cookie.setDomain("localhost");
        cookie.setPath("/");
        cookie.setSecure(false);
        state.addCookie(cookie);

        HttpClientBuilder client = ZimbraHttpConnectionManager.getInternalHttpConnMgr().newHttpClient();
        client.setDefaultCookieStore(state);
        post.addHeader(Constants.CSRF_TOKEN, csrfToken);
        HttpResponse httpResponse = HttpClientUtil.executeMethod(client.build(), post);
        int statusCode = httpResponse.getStatusLine().getStatusCode();
        assertEquals("This request should succeed. Getting status code " + statusCode, HttpStatus.SC_OK, statusCode);
        String resp = new String(ByteUtil.getContent(httpResponse.getEntity().getContent(), -1));
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
        HttpPost post = new HttpPost(Url);

        MultipartEntityBuilder builder = MultipartEntityBuilder.create();
        builder.addBinaryBody(FILE_NAME, "some file content".getBytes(), ContentType.DEFAULT_BINARY, FILE_NAME);
        HttpEntity entity = builder.build();
        post.setEntity(entity);
        String contentType = "application/x-msdownload";
        post.addHeader("Content-type", contentType);
        BasicCookieStore state = new BasicCookieStore();
        BasicClientCookie cookie = new BasicClientCookie(ZimbraCookie.authTokenCookieName(true), authToken);
        cookie.setDomain("localhost");
        cookie.setPath("/");
        cookie.setSecure(false);
        state.addCookie(cookie);

        HttpClientBuilder client = ZimbraHttpConnectionManager.getInternalHttpConnMgr().newHttpClient();
        client.setDefaultCookieStore(state);
        
        HttpResponse httpResponse = HttpClientUtil.executeMethod(client.build(), post);
        int statusCode = httpResponse.getStatusLine().getStatusCode();
        assertEquals("This request should not succeed. Getting status code " + statusCode, HttpStatus.SC_FORBIDDEN,
                statusCode);
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
        HttpPost post = new HttpPost(Url);
        MultipartEntityBuilder builder = MultipartEntityBuilder.create();

        builder.addTextBody("csrfToken", csrfToken);
        String contentType = "application/x-msdownload";
        post.addHeader("Content-type", contentType);

        BasicCookieStore state = new BasicCookieStore();
        BasicClientCookie cookie = new BasicClientCookie(ZimbraCookie.authTokenCookieName(true), authToken);
        cookie.setDomain("localhost");
        cookie.setPath("/");
        cookie.setSecure(false);
        state.addCookie(cookie);

        HttpClientBuilder client = ZimbraHttpConnectionManager.getInternalHttpConnMgr().newHttpClient();
        client.setDefaultCookieStore(state);

        HttpResponse httpResponse = HttpClientUtil.executeMethod(client.build(), post);
        int statusCode = httpResponse.getStatusLine().getStatusCode();

        assertEquals("This request should succeed. Getting status code " + statusCode, HttpStatus.SC_OK, statusCode);
        String resp = new String(ByteUtil.getContent(httpResponse.getEntity().getContent(), -1));
        assertNotNull("Response should not be empty", resp);
        assertTrue("Incorrect HTML response", resp.contains(RESP_STR));
    }
}
