package com.zimbra.bp;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.zimbra.common.localconfig.LC;
import com.zimbra.common.service.ServiceException;
import com.zimbra.common.util.ByteUtil;
import com.zimbra.common.util.ZimbraLog;
import com.zimbra.cs.account.AuthToken;
import com.zimbra.cs.extension.ExtensionHttpHandler;
import com.zimbra.cs.extension.ZimbraExtension;
import com.zimbra.cs.servlet.ZimbraServlet;

public class BulkDownloadServlet extends ExtensionHttpHandler {
    public static final String HANDLER_NAME = "bulkdownload";
    public static final String ACTION_GETSR = "getSR"; // get search results
    private static final String ACTION_GETBP_FILE = "getBulkFile"; // get search results
    private static final String fileFormat = "fileFormat";
    private static final String fileID = "fileID";

    @Override
    public void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException, ServletException {
        try {
            // check the auth token
            AuthToken authToken = ZimbraServlet.getAdminAuthTokenFromCookie(req, resp);
            if (authToken == null || !authToken.isAdmin()) {
                sendError(resp, HttpServletResponse.SC_FORBIDDEN, "Auth failed");
            }

            String action = req.getParameter("action");
            if (action != null && action.length() > 0) {
                ZimbraLog.extensions.debug("Received a file download request with action = %s", action);
            } else {
                return;
            }
            if (ACTION_GETSR.equalsIgnoreCase(action.trim())) {
                String query = req.getParameter("q");
                String domain = req.getParameter("domain");
                String types = req.getParameter("types");
                if(types == null) {
                    //DirectorySearch won't work without types, so make it required
                    sendError(resp, HttpServletResponse.SC_BAD_REQUEST, "'types' parameter is required");
                }
                resp.setHeader("Expires", "Tue, 24 Jan 2000 20:46:50 GMT");
                resp.setStatus(HttpServletResponse.SC_OK);
                resp.setContentType("application/x-download");
                resp.setHeader("Content-Disposition", "attachment; filename=search_result.csv");
                SearchResults.writeSearchResultOutputStream(resp.getOutputStream(), query, domain, types, authToken);
            } else if (action.equalsIgnoreCase(ACTION_GETBP_FILE)) {
                String pFileId = req.getParameter(fileID);
                String pFileFormat = req.getParameter(fileFormat);
                String bulkFileName = null;
                String clientFileName = null;
                if (pFileFormat.equalsIgnoreCase(ZimbraBulkProvisionExt.FILE_FORMAT_BULK_CSV)) {
                    bulkFileName = String.format("%s%s_bulk_%s_%s.csv", LC.zimbra_tmp_directory.value(),
                            File.separator, authToken.getAccountId(), pFileId);
                    clientFileName = "bulk_provision.csv";
                } else if (pFileFormat.equalsIgnoreCase(ZimbraBulkProvisionExt.FILE_FORMAT_BULK_XML)) {
                    bulkFileName = String.format("%s%s_bulk_%s_%s.xml", LC.zimbra_tmp_directory.value(),
                            File.separator, authToken.getAccountId(), pFileId);
                    clientFileName = "bulk_provision.xml";
                } else if (pFileFormat.equalsIgnoreCase(ZimbraBulkProvisionExt.FILE_FORMAT_MIGRATION_XML)) {
                    bulkFileName = String.format("%s%s_migration_%s_%s.xml", LC.zimbra_tmp_directory.value(),
                            File.separator, authToken.getAccountId(), pFileId);
                    clientFileName = "bulk_provision.xml";
                } else if (pFileFormat.equalsIgnoreCase(ZimbraBulkProvisionExt.FILE_FORMAT_BULK_IMPORT_ERRORS)) {
                    bulkFileName = String.format("%s%s_bulk_errors_%s_%s.csv", LC.zimbra_tmp_directory.value(),
                            File.separator, authToken.getAccountId(), pFileId);
                    clientFileName = "failed_accounts.csv";
                } else if (pFileFormat.equalsIgnoreCase(ZimbraBulkProvisionExt.FILE_FORMAT_BULK_IMPORT_REPORT)) {
                    bulkFileName = String.format("%s%s_bulk_report_%s_%s.csv", LC.zimbra_tmp_directory.value(),
                            File.separator, authToken.getAccountId(), pFileId);
                    clientFileName = "accounts_report.csv";
                }
                if (bulkFileName != null) {
                    InputStream is = null;
                    try {
                        is = new FileInputStream(bulkFileName);
                    } catch (FileNotFoundException ex) {
                        resp.sendError(HttpServletResponse.SC_NOT_FOUND, "File not found");
                        return;
                    }
                    resp.setHeader("Expires", "Tue, 24 Jan 2000 20:46:50 GMT");
                    resp.setStatus(HttpServletResponse.SC_OK);
                    resp.setContentType("application/x-download");
                    resp.setHeader("Content-Disposition", "attachment; filename=" + clientFileName);
                    try {
                        ByteUtil.copy(is, true, resp.getOutputStream(), false);
                    } catch (Exception e) {
                        ZimbraLog.webclient.error(e);
                    }
                    try {
                        is.close();
                        File file = new File(bulkFileName);
                        file.delete();
                    } catch (Exception e) {
                        ZimbraLog.webclient.error(e);
                    }
                }
            }
        } catch (Exception e) {
            ZimbraLog.extensions.error(e);
            return;
        }
    }

    @Override
    public void doPost(HttpServletRequest req, HttpServletResponse resp) throws IOException, ServletException {
        doGet(req, resp);
    }

    @Override
    public String getPath() {
        return super.getPath() + "/" + HANDLER_NAME;
    }

    @Override
    public void init(ZimbraExtension ext) throws ServiceException {
        super.init(ext);
        ZimbraLog.extensions.info("Handler at " + getPath() + " starting up");
    }

    @Override
    public void destroy() {
        ZimbraLog.extensions.info("Handler at " + getPath() + " shutting down");
    }

    private void sendError(HttpServletResponse resp, int sc, String msg) throws IOException {
        ZimbraLog.extensions.error(msg);
        resp.sendError(sc, msg);
    }
}
