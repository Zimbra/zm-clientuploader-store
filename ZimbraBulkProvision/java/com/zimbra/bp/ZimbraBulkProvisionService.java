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

import com.zimbra.common.soap.AdminExtConstants;
import com.zimbra.soap.DocumentService;
import com.zimbra.soap.DocumentDispatcher;

/**
 * Created by IntelliJ IDEA.
 * User: ccao
 * Date: Sep 11, 2008
 * Time: 10:59:29 AM
 */
public class ZimbraBulkProvisionService  implements DocumentService {

    public void registerHandlers(DocumentDispatcher dispatcher) {
        dispatcher.registerHandler(AdminExtConstants.BULK_IMPORT_ACCOUNTS_REQUEST, new BulkImportAccounts());
        dispatcher.registerHandler(AdminExtConstants.GENERATE_BULK_PROV_FROM_LDAP_REQUEST, new GenerateBulkProvisionFileFromLDAP());
        dispatcher.registerHandler(AdminExtConstants.BULK_IMAP_DATA_IMPORT_REQUEST, new BulkIMAPDataImport());
        dispatcher.registerHandler(AdminExtConstants.GET_BULK_IMAP_IMPORT_TASKLIST_REQUEST, new GetBulkIMAPImportTaskList());
        dispatcher.registerHandler(AdminExtConstants.PURGE_BULK_IMAP_IMPORT_TASKS_REQUEST, new PurgeIMAPImportTasks());
    }
}
