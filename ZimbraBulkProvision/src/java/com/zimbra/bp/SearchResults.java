/*
 * ***** BEGIN LICENSE BLOCK *****
 * Zimbra Collaboration Suite Server
 * Copyright (C) 2009, 2010, 2011, 2012, 2013, 2014 Zimbra, Inc.
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

import java.io.FileOutputStream;
import java.io.OutputStream;
import java.io.OutputStreamWriter;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVPrinter;

import com.zimbra.common.account.Key;
import com.zimbra.common.account.ZAttrProvisioning;
import com.zimbra.common.service.ServiceException;
import com.zimbra.common.soap.AdminConstants;
import com.zimbra.common.util.ZimbraLog;
import com.zimbra.cs.account.Account;
import com.zimbra.cs.account.AccountServiceException;
import com.zimbra.cs.account.Alias;
import com.zimbra.cs.account.AuthToken;
import com.zimbra.cs.account.CalendarResource;
import com.zimbra.cs.account.Cos;
import com.zimbra.cs.account.DistributionList;
import com.zimbra.cs.account.Domain;
import com.zimbra.cs.account.NamedEntry;
import com.zimbra.cs.account.Provisioning;
import com.zimbra.cs.account.SearchDirectoryOptions;
import com.zimbra.cs.ldap.LdapDateUtil;
import com.zimbra.cs.ldap.ZLdapFilterFactory.FilterId;
import com.zimbra.cs.service.admin.AdminAccessControl;

/**
 * Created by IntelliJ IDEA.
 * User: ccao
 * Date: Feb 17, 2009
 * Time: 5:06:46 PM
 * To change this template use File | Settings | File Templates.
 */
public class SearchResults {
    public static String [] ACCOUNT_ATTRS = {ZAttrProvisioning.A_displayName, 
        ZAttrProvisioning.A_zimbraAccountStatus, ZAttrProvisioning.A_zimbraCOSId};
    private static Set<String> ACCOUNT_ATTRS_SET = new HashSet<String>(Arrays.asList(ACCOUNT_ATTRS));
    private static String DATE_PATTERN = "yyyy.MM.dd, hh:mm:ss z";

    /**
     * The CSV file format will be
     * name, zimbraId, type, [displayName, zimbraAccountStatus, zimbraCOSId, zimbraLastLoginTimestamp]
     * @param out
     * @param query
     * @param domain
     * @param types
     */
    public static void writeSearchResultOutputStream (OutputStream out, String query, String domain, String types, AuthToken token)
    throws ServiceException{
        try {
            CSVPrinter printer = CSVFormat.DEFAULT.withNullString("").print(new OutputStreamWriter(out, "UTF-8"));
            List<NamedEntry> entryList = getSearchResults(token, query, domain, types);
            SimpleDateFormat formatter = new SimpleDateFormat(DATE_PATTERN);
            ZimbraLog.extensions.debug("Writing out CSV file with %d search results", entryList.size());
            for (int i = 0; i < entryList.size(); i++) {
                List<String> line = new ArrayList<String>();
                NamedEntry entry = (NamedEntry) entryList.get(i);
                line.add(entry.getName());
                line.add(entry.getId());

                if (entry instanceof CalendarResource) {
                    line.add(AdminConstants.E_CALENDAR_RESOURCE);
                } else if (entry instanceof Account) {
                    line.add(AdminConstants.E_ACCOUNT);
                } else if (entry instanceof DistributionList) {
                    line.add(AdminConstants.E_DL);
                } else if (entry instanceof Alias) {
                    line.add(AdminConstants.E_ALIAS);
                } else if (entry instanceof Domain) {
                    line.add(AdminConstants.E_DOMAIN);
                } else if (entry instanceof Cos) {
                    line.add(AdminConstants.E_COS);
                }

                for (int j = 0; j < ACCOUNT_ATTRS.length; j++) {
                    String val = entry.getAttr(ACCOUNT_ATTRS[j]);
                    line.add(val);
                }
                String lastLogon = entry.getAttr(ZAttrProvisioning.A_zimbraLastLogonTimestamp);
                if (lastLogon != null) {
                    Date date = LdapDateUtil.parseGeneralizedTime(lastLogon);
                    line.add(formatter.format(date));
                }
                printer.printRecord(line);
            }
            printer.close();
        } catch (Exception e) {
            ZimbraLog.extensions.error(e);
            throw ServiceException.FAILURE(e.getMessage(), e);
        }
    }

    private static List<NamedEntry> getSearchResults (AuthToken authToken, String query, String domain, String types)
    throws ServiceException {
        Provisioning prov = Provisioning.getInstance();
        Domain d = null;
        if (domain != null) {
            d = prov.get(Key.DomainBy.name, domain);
            if (d == null) {
                throw AccountServiceException.NO_SUCH_DOMAIN(domain);
            }
        }
        ZimbraLog.extensions.debug("Performing a directory search. Query: %s, Domain: %s, Types: %s", query, domain, types);
        SearchDirectoryOptions options = new SearchDirectoryOptions();
        options.setTypes(types);
        if(d != null) {
            options.setDomain(d);
        }
        options.setFilterString(FilterId.ADMIN_SEARCH, query);
        options.setReturnAttrs(ACCOUNT_ATTRS);
        options.setConvertIDNToAscii(true);
        List<NamedEntry> accounts = prov.searchDirectory(options);

        // check rights and only returns allowed entries
        AdminAccessControl aac = AdminAccessControl.getAdminAccessControl(authToken);
        AdminAccessControl.SearchDirectoryRightChecker rightChecker =
            new AdminAccessControl.SearchDirectoryRightChecker(aac, prov, ACCOUNT_ATTRS_SET);
        accounts = rightChecker.getAllowed(accounts, accounts.size());
        return accounts;
    }

    public static void main (String [] args) throws ServiceException {
        try {
            // List accounts = getSearchResults("", "ccaomac.zimbra.com", "accounts, aliases, aliases, resources, domains, coses" );
            FileOutputStream fo = new FileOutputStream ("/tmp/sr_out") ;
            writeSearchResultOutputStream(fo, "", null, "accounts, distributionlists, aliases, resources,domains", null) ;
        }catch (Exception e) {
            e.printStackTrace();
        }
    }
}
