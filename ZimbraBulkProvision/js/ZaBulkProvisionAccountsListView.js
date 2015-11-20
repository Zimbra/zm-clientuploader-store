/*
 * ***** BEGIN LICENSE BLOCK *****
 * Zimbra Collaboration Suite Server
 * Copyright (C) 2008, 2014 Zimbra, Inc.
 * 
 * The contents of this file are subject to the Common Public Attribution License Version 1.0 (the "License");
 * you may not use this file except in compliance with the License. 
 * You may obtain a copy of the License at: http://www.zimbra.com/license
 * The License is based on the Mozilla Public License Version 1.1 but Sections 14 and 15 
 * have been added to cover use of software over a computer network and provide for limited attribution 
 * for the Original Developer. In addition, Exhibit A has been modified to be consistent with Exhibit B. 
 * 
 * Software distributed under the License is distributed on an "AS IS" basis, 
 * WITHOUT WARRANTY OF ANY KIND, either express or implied. 
 * See the License for the specific language governing rights and limitations under the License. 
 * The Original Code is Zimbra Open Source Web Client. 
 * The Initial Developer of the Original Code is Zimbra, Inc. 
 * All portions of the code are Copyright (C) 2008, 2014 Zimbra, Inc. All Rights Reserved. 
 * ***** END LICENSE BLOCK *****
 */
//-------------------------------------------------------------------------------------------------------
//List View for the zimbraDomainCOSMaxAccounts

ZaBulkProvisionAccountsListView = function(parent, className, posStyle, headerList) {
	if (arguments.length == 0) return;
	ZaListView.call(this, parent, className, posStyle, headerList);
	this.hideHeader = true;
    this._app = ZaApp.getInstance();

}

ZaBulkProvisionAccountsListView.prototype = new ZaListView;
ZaBulkProvisionAccountsListView.prototype.constructor = ZaBulkProvisionAccountsListView;

ZaBulkProvisionAccountsListView.prototype.toString = function() {
	return "ZaBulkProvisionAccountsListView";
};

ZaBulkProvisionAccountsListView.prototype.createHeaderHtml = function (defaultColumnSort) {
	if(!this.hideHeader) {
		DwtListView.prototype.createHeaderHtml.call(this,defaultColumnSort);
	}
}


ZaBulkProvisionAccountsListView.prototype._createItemHtml =
function(item) {
	var html = new Array(50);
	var	div = document.createElement("div");
	div[DwtListView._STYLE_CLASS] = "Row";
    div[DwtListView._SELECTED_STYLE_CLASS] = div[DwtListView._STYLE_CLASS] + "-" + DwtCssStyle.SELECTED;
	div.className = div[DwtListView._STYLE_CLASS];

    var id = this.associateItemWithElement(item, div, DwtListView.TYPE_LIST_ITEM);

    var idx = 0;
	html[idx++] = "<table width='100%' cellspacing='2' cellpadding='0'" ;
    if (item[ZaBulkProvision.A2_isValid] != "TRUE") {
        html[idx++] = " style='background: #ee1122;' ";
    }
    html[idx++] = ">";
    html[idx++] = "<tr>";

    if (item[ZaBulkProvision.A2_isValid] != "TRUE") {
        html[idx++] = "<td align='left' colspan=3><nobr>";
        html[idx++] = AjxStringUtil.htmlEncode(item[ZaBulkProvision.A2_status]);
        html[idx++] = "</nobr></td>";
    }   else {
        var cnt = this._headerList.length;
        for(var i = 0; i < cnt; i++) {
            var field = this._headerList[i]._field;

            html[idx++] = "<td align='left' width=" + this._headerList[i]._width + "><nobr>";
            html[idx++] = AjxStringUtil.htmlEncode(item[field]);
            html[idx++] = "</nobr></td>";
        }
    }

    html[idx++] = "</tr></table>";
	div.innerHTML = html.join("");
	return div;
}


ZaBulkProvisionAccountsListView.prototype._setNoResultsHtml = function() {
	var buffer = new AjxBuffer();
	var	div = document.createElement("div");

	buffer.append("<table width='100%' cellspacing='0' cellpadding='1'>",
				  "<tr><td class='NoResults'><br />",
                  com_zimbra_bulkprovision.no_accounts,
                  "</td></tr></table>");

	div.innerHTML = buffer.toString();
	this._addRow(div);
};