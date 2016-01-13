/*
 * ***** BEGIN LICENSE BLOCK *****
 * Zimbra Collaboration Suite Server
 * Copyright (C) 2008, 2009, 2010, 2011, 2013, 2014 Zimbra, Inc.
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
package com.zimbra.bp;

import com.zimbra.common.service.ServiceException;
import com.zimbra.common.util.ZimbraLog;
import com.zimbra.qa.unittest.TestBulkProvision;
import com.zimbra.qa.unittest.TestSearchResultsDownload;
import com.zimbra.qa.unittest.ZimbraSuite;
import com.zimbra.soap.SoapServlet;
import com.zimbra.cs.extension.ExtensionDispatcherServlet;
import com.zimbra.cs.extension.ZimbraExtension;

/**
 * Created by IntelliJ IDEA.
 * User: ccao
 * Date: Sep 11, 2008
 * Time: 10:56:57 AM
 * To change this template use File | Settings | File Templates.
 */
public class ZimbraBulkProvisionExt implements ZimbraExtension {

    public static final String EXTENSION_NAME_BULKPROVISION = "com_zimbra_bulkprovision";
    public static final String FILE_FORMAT_BULK_LDAP = "ldap";
    public static final String FILE_FORMAT_BULK_AD = "ad";
    public static final String FILE_FORMAT_ZIMBRA = "zimbra";
    public static final String EXCHANGE_IMAP = "EXCHANGE_IMAP";
    public static final String DEFAULT_INDEX_BATCH_SIZE = "40";
    
    public static final String OP_GET_STATUS = "getStatus";
    public static final String OP_PREVIEW = "preview";
    public static final String OP_PREVIEW_ACTIVE_IMPORTS = "previewActiveImports";
    public static final String OP_START_IMPORT = "startImport";
    public static final String OP_ABORT_IMPORT = "abortImport";
    public static final String OP_DISMISS_IMPORT = "dismissImport";
    public static final String IMAP_IMPORT_DS_NAME = "__imap_import__";
    public static final String FILE_FORMAT_MIGRATION_XML = "migrationxml";
    public static final String FILE_FORMAT_BULK_XML = "bulkxml";
    public static final String FILE_FORMAT_BULK_CSV = "csv";
    public static final String FILE_FORMAT_BULK_IMPORT_ERRORS = "errorscsv";
    public static final String FILE_FORMAT_BULK_IMPORT_REPORT = "reportcsv";

    public void destroy() {
        ExtensionDispatcherServlet.unregister(this);
    }

    @Override
    public String getName() {
        return EXTENSION_NAME_BULKPROVISION;
    }

    public void init() throws ServiceException {
        try {
            ZimbraSuite.addTest(TestSearchResultsDownload.class);
            ZimbraSuite.addTest(TestBulkProvision.class);
        } catch (NoClassDefFoundError e) {
            // Expected in production, because JUnit is not available.
            ZimbraLog.test.debug("Unable to load TestSearchResultsDownload unit tests.", e);
        }
        ExtensionDispatcherServlet.register(this, new BulkDownloadServlet());
        //need to add the service calls to the admin soap calls
        SoapServlet.addService("AdminServlet", new ZimbraBulkProvisionService());
    }
}
