/*
 * ***** BEGIN LICENSE BLOCK *****
 * Zimbra Collaboration Suite Server
 * Copyright (C) 2010, 2011, 2013, 2014 Zimbra, Inc.
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

import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;
import java.util.Queue;

import com.zimbra.bp.BulkIMAPImportTaskManager.taskKeys;
import com.zimbra.common.service.ServiceException;
import com.zimbra.common.soap.AdminConstants;
import com.zimbra.common.soap.AdminExtConstants;
import com.zimbra.common.soap.Element;
import com.zimbra.cs.account.Account;
import com.zimbra.cs.account.AttributeManager.IDNType;
import com.zimbra.cs.account.Provisioning;
import com.zimbra.cs.account.accesscontrol.AccessControlUtil;
import com.zimbra.cs.service.admin.AdminDocumentHandler;
import com.zimbra.cs.service.admin.ToXML;
import com.zimbra.soap.DocumentHandler;
import com.zimbra.soap.ZimbraSoapContext;

public class GetBulkIMAPImportTaskList extends AdminDocumentHandler  {
    @Override
    public Element handle(Element request, Map<String, Object> context)
            throws ServiceException {
        ZimbraSoapContext zsc = getZimbraSoapContext(context);
        Account authedAcct = DocumentHandler.getAuthenticatedAccount(zsc);
        Element response = zsc.createElement(AdminExtConstants.GET_BULK_IMAP_IMPORT_TASKLIST_RESPONSE);
        HashMap<String, Queue<HashMap<taskKeys, String>>> importQueues = BulkIMAPImportTaskManager.getImportQueues();
        if(AccessControlUtil.isGlobalAdmin(authedAcct, true)) {
            synchronized(importQueues) {
               Iterator<String> keyIter = importQueues.keySet().iterator();
               while(keyIter.hasNext()) {
                   encodeTask(response,keyIter.next());
               }
            }
        } else {
            String adminID = zsc.getAuthtokenAccountId();
            if(importQueues.containsKey(adminID)) {
                encodeTask(response,adminID);
            }
        }
        return response;
    }

    private void encodeTask (Element response, String adminID) throws ServiceException {
        Account acct = Provisioning.getInstance().getAccountById(adminID);
        Queue<HashMap<taskKeys, String>> fq =  BulkIMAPImportTaskManager.getFinishedQueue(adminID);
        Queue<HashMap<taskKeys, String>> eq =  BulkIMAPImportTaskManager.getFailedQueue(adminID);
        int numFinished = 0;
        if(fq!=null) {
            synchronized(fq) {
                numFinished = fq.size();
            }
        }
        int numFailed = 0;
        if(eq!=null) {
            synchronized(eq) {
                numFailed = eq.size();
            }
        }
        int numTotal = 0;
        Queue<HashMap<taskKeys, String>> rq =  BulkIMAPImportTaskManager.getRunningQueue(adminID);
        if(rq!=null) {
            synchronized(rq) {
                numTotal = rq.size();
            }
        }
        Element elTask = response.addUniqueElement(AdminExtConstants.E_Task);
        ToXML.encodeAttr(elTask,AdminExtConstants.A_owner,acct.getName(),AdminConstants.E_A,AdminConstants.A_N,IDNType.none, true);
        ToXML.encodeAttr(elTask,AdminExtConstants.A_totalTasks,Integer.toString(numTotal),AdminConstants.E_A,AdminConstants.A_N,IDNType.none, true);
        ToXML.encodeAttr(elTask,AdminExtConstants.A_finishedTasks,Integer.toString(numFinished),AdminConstants.E_A,AdminConstants.A_N,IDNType.none, true);
        ToXML.encodeAttr(elTask,AdminExtConstants.A_failedTasks,Integer.toString(numFailed),AdminConstants.E_A,AdminConstants.A_N,IDNType.none, true);
    }
}
