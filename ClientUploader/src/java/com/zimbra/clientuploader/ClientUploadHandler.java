/*
 * ***** BEGIN LICENSE BLOCK *****
 * Zimbra Collaboration Suite Server
 * Copyright (C) 2012, 2013, 2014 Zimbra, Inc.
 * 
 * This program is free software: you can redistribute it and/or modify it under
 * the terms of the GNU General Public License as published by the Free Software Foundation,
 * version 2 of the License.
 * 
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY;
 * without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
 * See the GNU General Public License for more details.
 * You should have received a copy of the GNU General Public License along with this program.
 * If not, see <http://www.gnu.org/licenses/>.
 * ***** END LICENSE BLOCK *****
 */
package com.zimbra.clientuploader;

import java.io.IOException;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.fileupload.FileItem;
import org.apache.commons.fileupload.servlet.ServletFileUpload;

import com.zimbra.common.util.Constants;
import com.zimbra.common.util.StringUtil;
import com.zimbra.cs.account.AuthToken;
import com.zimbra.cs.account.Provisioning;
import com.zimbra.cs.account.accesscontrol.RightCommand;
import com.zimbra.cs.extension.ExtensionHttpHandler;
import com.zimbra.cs.service.FileUploadServlet;
import com.zimbra.cs.servlet.CsrfFilter;
import com.zimbra.cs.servlet.ZimbraServlet;
import com.zimbra.cs.servlet.util.CsrfUtil;
import com.zimbra.soap.admin.type.GranteeSelector.GranteeBy;

/**
 * A handler to deal with uploading client software request.
 *
 * @author Dongwei Feng
 * @since 2012.3.14
 */
public class ClientUploadHandler extends ExtensionHttpHandler {
    public static final String HANDLER_PATH_NAME = "upload";
    private static final String TARGET_TYPE = "global";
    private static final String UPLOAD_PERMISSION = "uploadClientSoftware";

    @Override
    public void doPost(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        String reqId = req.getParameter("requestId");
        ZClientUploadManager man = new ZClientUploadManager();
        try {
            AuthToken authToken = ZimbraServlet.getAdminAuthTokenFromCookie(req, resp);
            if (!authenticate(authToken, resp)){
                FileUploadServlet.drainRequestStream(req);
                return;
            }

            boolean doCsrfCheck = false;
            boolean csrfCheckComplete = false;
            if (req.getAttribute(CsrfFilter.CSRF_TOKEN_CHECK) != null) {
                doCsrfCheck = (Boolean) req.getAttribute(CsrfFilter.CSRF_TOKEN_CHECK);
            }

            if (doCsrfCheck) {
                String csrfToken = req.getHeader(Constants.CSRF_TOKEN);
                if (!StringUtil.isNullOrEmpty(csrfToken)) {
                    if (!CsrfUtil.isValidCsrfToken(csrfToken, authToken)) {
                        FileUploadServlet.drainRequestStream(req);
                        throw new ZClientUploaderException(ZClientUploaderRespCode.NO_PERMISSION);
                    }
                    csrfCheckComplete = true;
                }
            } else {
                csrfCheckComplete = true;
            }

            if (!ServletFileUpload.isMultipartContent(req)) {
                FileUploadServlet.drainRequestStream(req);
                throw new ZClientUploaderException(ZClientUploaderRespCode.NOT_A_FILE);
            }

            ServletFileUpload upload = FileUploadServlet.getUploader(ClientUploaderLC.client_software_max_size
                    .longValue());
            @SuppressWarnings("unchecked")
            List<FileItem> items = upload.parseRequest(req);

            // look for csrf token in form fields if we did not find it in X-Zimbra-Csrf header
            if (!csrfCheckComplete && !CsrfUtil.checkCsrfInMultipartFileUpload(items, authToken)) {
                FileUploadServlet.drainRequestStream(req);
                throw new ZClientUploaderException(ZClientUploaderRespCode.NO_PERMISSION);
            }

            checkRight(authToken);
            man.uploadClient(items);
            sendSuccess(resp, reqId);
        } catch (ZClientUploaderException e) {
            Log.clientUploader.error("",e);
            String msg;
            int sc = HttpServletResponse.SC_OK;
            switch (e.getRespCode()) {
            case FILE_EXCEED_LIMIT:
                msg = ZClientUploaderRespCode.FILE_EXCEED_LIMIT.getDescription();
                break;
            case NOT_A_FILE:
                msg = ZClientUploaderRespCode.NOT_A_FILE.getDescription();
                break;
            case NO_PERMISSION:
                sc = HttpServletResponse.SC_FORBIDDEN;
                msg = ZClientUploaderRespCode.NO_PERMISSION.getDescription();
                break;
            case MISSING_LIB_PATH:
            case UPDATE_LINK_FAILED:
                msg = ZClientUploaderRespCode.UPDATE_LINK_FAILED.getDescription();
                break;
            default:
                msg = ZClientUploaderRespCode.FAILED.getDescription();
            }
            sendError(resp, sc, e.getRespCode().getCode(), reqId, msg);
        } catch (Exception e) {
            Log.clientUploader.error("Unexpected error", e);
            sendError(resp, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, ZClientUploaderRespCode.FAILED.getCode(),
                    reqId,
                    ZClientUploaderRespCode.FAILED.getDescription());
        }
    }

    private boolean authenticate(AuthToken authToken, HttpServletResponse resp) throws IOException {
        if (authToken == null) {
            Log.clientUploader.warn("Auth failed");
            sendError(resp, HttpServletResponse.SC_FORBIDDEN, HttpServletResponse.SC_FORBIDDEN, "Auth failed", null);
            return false;
        }
        return true;
    }

    private void checkRight(AuthToken authToken) throws ZClientUploaderException {
        if (authToken.isAdmin()) {
            return;
        }

        if (authToken.isDomainAdmin() || authToken.isDelegatedAdmin()) {
            try {
                RightCommand.EffectiveRights rights = Provisioning.getInstance().getEffectiveRights(TARGET_TYPE, null, null,
                        GranteeBy.id, authToken.getAccountId(),
                        false, false);
                List<String> preRights = rights.presetRights();
                for (String r : preRights) {
                    if (UPLOAD_PERMISSION.equalsIgnoreCase(r)) {
                        return;
                    }
                }
            } catch (Exception e) {
                Log.clientUploader.warn("Failed to check right.");
            }
        }

        throw new ZClientUploaderException(ZClientUploaderRespCode.NO_PERMISSION);
    }

    @Override
    public String getPath() {
        return super.getPath() + "/" + HANDLER_PATH_NAME;
    }

    private void sendError(HttpServletResponse resp, int sc, long respCode, String msg, String requestId)
            throws IOException {
        Log.clientUploader.error("Failed to process request: " + msg);
        if (sc == HttpServletResponse.SC_OK) {
            resp.setStatus(sc);
            resp.getWriter().write(getResponseBody(respCode, requestId, msg));
            resp.getWriter().flush();
            resp.getWriter().close();
        } else {
            resp.sendError(sc, this.getResponseBody(respCode, requestId, msg));
        }
    }

    private void sendSuccess(HttpServletResponse resp, String requestId) throws IOException {
        resp.setStatus(HttpServletResponse.SC_OK);
        resp.getWriter().write(getResponseBody(ZClientUploaderRespCode.SUCCEEDED.getCode(), requestId));
        resp.getWriter().flush();
        resp.getWriter().close();
    }

    private String getResponseBody(long statusCode, String requestId) {
        return getResponseBody(statusCode, requestId, null);
    }

    private String getResponseBody(long statusCode, String requestId, String msg) {
        StringBuilder sb = new StringBuilder();
        sb.append("<html><head></head><body onload=\"window.parent._uploadManager.loaded(")
                .append(statusCode)
                .append(",'")
                .append(requestId != null ? StringUtil.jsEncode(requestId) : "null")
                .append("'")
                .append(");\">");
        if (msg != null && !msg.isEmpty()) {
             sb.append(msg);
        }
        sb.append("</body></html>");

        return sb.toString();
    }
}
