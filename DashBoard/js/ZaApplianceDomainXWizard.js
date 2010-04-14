/*
 * ***** BEGIN LICENSE BLOCK *****
 * Zimbra Collaboration Suite Web Client
 * Copyright (C) 2005, 2006, 2007, 2008, 2009, 2010 Zimbra, Inc.
 * 
 * The contents of this file are subject to the Zimbra Public License
 * Version 1.3 ("License"); you may not use this file except in
 * compliance with the License.  You may obtain a copy of the License at
 * http://www.zimbra.com/license.
 * 
 * Software distributed under the License is distributed on an "AS IS"
 * basis, WITHOUT WARRANTY OF ANY KIND, either express or implied.
 * ***** END LICENSE BLOCK *****
 */

/**
* @class ZaApplianceDomainXWizard
* @contructor
* @param parent
* @param app
* @author Greg Solovyev
**/
ZaApplianceDomainXWizard = function(parent, entry) {
	ZaXWizardDialog.call(this, parent, null, ZaMsg.NDD_Title, "700px", "350px","ZaApplianceDomainXWizard");
	
	this.TAB_INDEX = 0;
	
	ZaApplianceDomainXWizard.GENERAL_STEP = ++this.TAB_INDEX;
	ZaApplianceDomainXWizard.GALMODE_STEP = ++this.TAB_INDEX;
	ZaApplianceDomainXWizard.GAL_CONFIG_STEP_2 = ++this.TAB_INDEX;
	//ZaApplianceDomainXWizard.GAL_SYNC_CONFIG_STEP_1 = ++this.TAB_INDEX;
	//ZaApplianceDomainXWizard.GAL_SYNC_CONFIG_STEP_2 = ++this.TAB_INDEX;
	ZaApplianceDomainXWizard.GAL_CONFIG_SUM_STEP = ++this.TAB_INDEX;
	ZaApplianceDomainXWizard.GAL_TEST_RESULT_STEP = ++this.TAB_INDEX;
	//ZaApplianceDomainXWizard.SYNC_CONFIG_SUM_STEP = ++this.TAB_INDEX;
	//ZaApplianceDomainXWizard.SYNC_TEST_RESULT_STEP = ++this.TAB_INDEX;	
	ZaApplianceDomainXWizard.AUTH_MODE_STEP = ++this.TAB_INDEX;
	ZaApplianceDomainXWizard.AUTH_CONFIG_STEP_2 = ++this.TAB_INDEX;
	ZaApplianceDomainXWizard.AUTH_CONFIG_SUM_STEP = ++this.TAB_INDEX;
	ZaApplianceDomainXWizard.AUTH_TEST_RESULT_STEP = ++this.TAB_INDEX;
	ZaApplianceDomainXWizard.VHOST_STEP = ++this.TAB_INDEX;
	ZaApplianceDomainXWizard.NOTEBOOK_STEP = ++this.TAB_INDEX;
	ZaApplianceDomainXWizard.NOTEBOOK_ACL_STEP = ++this.TAB_INDEX;
	ZaApplianceDomainXWizard.CONFIG_COMPLETE_STEP = ++this.TAB_INDEX;
	
	this.stepChoices = [
		{label:ZaMsg.TABT_GeneralPage, value:ZaApplianceDomainXWizard.GENERAL_STEP},
		{label:ZaMsg.GALConfiguration, value:ZaApplianceDomainXWizard.GALMODE_STEP},
		{label:ZaMsg.GALConfiguration, value:ZaApplianceDomainXWizard.GAL_CONFIG_STEP_2}, 
		//{label:ZaMsg.GALSyncConfiguration, value:ZaApplianceDomainXWizard.GAL_SYNC_CONFIG_STEP_1},
		//{label:ZaMsg.GALSyncConfiguration, value:ZaApplianceDomainXWizard.GAL_SYNC_CONFIG_STEP_2},				
		{label:ZaMsg.GALConfigSummary, value:ZaApplianceDomainXWizard.GAL_CONFIG_SUM_STEP},
		{label:ZaMsg.GalTestResult, value:ZaApplianceDomainXWizard.GAL_TEST_RESULT_STEP},	
		//{label:ZaMsg.SyncConfigSummary, value:ZaApplianceDomainXWizard.SYNC_CONFIG_SUM_STEP},
		//{label:ZaMsg.SyncTestResult, value:ZaApplianceDomainXWizard.SYNC_TEST_RESULT_STEP},		
		{label:ZaMsg.AuthMode, value:ZaApplianceDomainXWizard.AUTH_MODE_STEP},										
		{label:ZaMsg.AuthSettings, value:ZaApplianceDomainXWizard.AUTH_CONFIG_STEP_2},								
		{label:ZaMsg.AuthSettingsSummary, value:ZaApplianceDomainXWizard.AUTH_CONFIG_SUM_STEP},												
		{label:ZaMsg.AuthTestResult, value:ZaApplianceDomainXWizard.AUTH_TEST_RESULT_STEP},
		{label:ZaMsg.Domain_Tab_VirtualHost, value:ZaApplianceDomainXWizard.VHOST_STEP},
		{label:ZaMsg.Domain_Tab_Notebook, value:ZaApplianceDomainXWizard.NOTEBOOK_STEP},		
		{label:ZaMsg.Notebook_Access_Control, value:ZaApplianceDomainXWizard.NOTEBOOK_ACL_STEP},			
		{label:ZaMsg.DomainConfigComplete, value:ZaApplianceDomainXWizard.CONFIG_COMPLETE_STEP}		
	];
		
	this.GALModes = [
		{label:ZaMsg.GALMode_internal, value:ZaDomain.GAL_Mode_internal},
		{label:ZaMsg.GALMode_external, value:ZaDomain.GAL_Mode_external}, 
		{label:ZaMsg.GALMode_both, value:ZaDomain.GAL_Mode_both}
  	];
  	this.GALServerTypes = [
		{label:ZaMsg.GALServerType_ldap, value:ZaDomain.GAL_ServerType_ldap},
		{label:ZaMsg.GALServerType_ad, value:ZaDomain.GAL_ServerType_ad} 
	];
	
	this.AuthMechs = [
		{label:ZaMsg.AuthMech_zimbra, value:ZaDomain.AuthMech_zimbra},
		{label:ZaMsg.AuthMech_ldap, value:ZaDomain.AuthMech_ldap},
		{label:ZaMsg.AuthMech_ad, value:ZaDomain.AuthMech_ad}		
	];

	this.TestResultChoices = [
		{label:ZaMsg.AuthTest_check_OK, value:ZaDomain.Check_OK},
		{label:ZaMsg.AuthTest_check_UNKNOWN_HOST, value:ZaDomain.Check_UNKNOWN_HOST},
		{label:ZaMsg.AuthTest_check_CONNECTION_REFUSED, value:ZaDomain.Check_CONNECTION_REFUSED},
		{label:ZaMsg.AuthTest_check_SSL_HANDSHAKE_FAILURE, value:ZaDomain.Check_SSL_HANDSHAKE_FAILURE},				
		{label:ZaMsg.AuthTest_check_COMMUNICATION_FAILURE, value:ZaDomain.Check_COMMUNICATION_FAILURE},
		{label:ZaMsg.AuthTest_check_AUTH_FAILED, value:ZaDomain.Check_AUTH_FAILED},
		{label:ZaMsg.AuthTest_check_AUTH_NOT_SUPPORTED, value:ZaDomain.Check_AUTH_NOT_SUPPORTED},
		{label:ZaMsg.AuthTest_check_NAME_NOT_FOUND, value:ZaDomain.Check_NAME_NOT_FOUND},
		{label:ZaMsg.AuthTest_check_INVALID_SEARCH_FILTER, value:ZaDomain.Check_INVALID_SEARCH_FILTER},
		{label:ZaMsg.AuthTest_check_FAILURE, value:ZaDomain.Check_FAILURE}												
	];
		
	this.initForm(ZaDomain.myXModel,this.getMyXForm(entry), null);		
	this._localXForm.addListener(DwtEvent.XFORMS_FORM_DIRTY_CHANGE, new AjxListener(this, ZaApplianceDomainXWizard.prototype.handleXFormChange));
	this._localXForm.addListener(DwtEvent.XFORMS_VALUE_ERROR, new AjxListener(this, ZaApplianceDomainXWizard.prototype.handleXFormChange));	
	this.lastErrorStep=0;
	this._helpURL = location.pathname + ZaUtil.HELP_URL + "managing_domains/creating_a_domain.htm?locid="+AjxEnv.DEFAULT_LOCALE;
}

ZaApplianceDomainXWizard.prototype = new ZaXWizardDialog;
ZaApplianceDomainXWizard.prototype.constructor = ZaApplianceDomainXWizard;
ZaXDialog.XFormModifiers["ZaApplianceDomainXWizard"] = new Array();

ZaApplianceDomainXWizard.prototype.handleXFormChange = 
function () {
	if(this._localXForm.hasErrors()) {
		if(this.lastErrorStep < this._containedObject[ZaModel.currentStep])
			this.lastErrorStep=this._containedObject[ZaModel.currentStep];
	} else {
		this.lastErrorStep=0;
	}
	this.changeButtonStateForStep(this._containedObject[ZaModel.currentStep]);	
}

ZaApplianceDomainXWizard.prototype.changeButtonStateForStep = 
function(stepNum) {
	if(this.lastErrorStep == stepNum) {
		this._button[DwtWizardDialog.FINISH_BUTTON].setEnabled(false);
		this._button[DwtWizardDialog.NEXT_BUTTON].setEnabled(false);
		if(stepNum>ZaApplianceDomainXWizard.GENERAL_STEP)
			this._button[DwtWizardDialog.PREV_BUTTON].setEnabled(true);
	} else {
		if(stepNum == ZaApplianceDomainXWizard.GENERAL_STEP) {
			this._button[DwtWizardDialog.NEXT_BUTTON].setEnabled(true);
			this._button[DwtWizardDialog.PREV_BUTTON].setEnabled(false);
			this._button[DwtWizardDialog.FINISH_BUTTON].setEnabled(true);
		} else if (stepNum == ZaApplianceDomainXWizard.GALMODE_STEP) {
			this._button[DwtWizardDialog.PREV_BUTTON].setEnabled(true);
			this._button[DwtWizardDialog.NEXT_BUTTON].setEnabled(true);
		} else if(stepNum == ZaApplianceDomainXWizard.GAL_CONFIG_SUM_STEP) {
			//change next button to "test"
			//this._button[DwtWizardDialog.NEXT_BUTTON].setText(ZaMsg.Domain_GALTestSettings);
			this._button[DwtWizardDialog.PREV_BUTTON].setEnabled(true);
			this._button[DwtWizardDialog.NEXT_BUTTON].setEnabled(true);
			this._button[DwtWizardDialog.FINISH_BUTTON].setEnabled(true);
		} else if(stepNum == ZaApplianceDomainXWizard.AUTH_TEST_STEP) {
			this._button[DwtWizardDialog.NEXT_BUTTON].setText(AjxMsg._next);
			this._button[DwtWizardDialog.NEXT_BUTTON].setEnabled(false);
			this._button[DwtWizardDialog.PREV_BUTTON].setEnabled(false);
			this._button[DwtWizardDialog.FINISH_BUTTON].setEnabled(false);
		} else if(stepNum == ZaApplianceDomainXWizard.CONFIG_COMPLETE_STEP) {
			this._button[DwtWizardDialog.NEXT_BUTTON].setEnabled(false);
		} else {
			this._button[DwtWizardDialog.PREV_BUTTON].setEnabled(true);
			this._button[DwtWizardDialog.NEXT_BUTTON].setEnabled(true);
		}
	}
}
/**
* @method setObject sets the object contained in the view
* @param entry - ZaDomain object to display
**/
ZaApplianceDomainXWizard.prototype.setObject =
function(entry) {
	this._containedObject = new Object();
	this._containedObject.attrs = new Object();

	for (var a in entry.attrs) {
		this._containedObject.attrs[a] = entry.attrs[a];
	}
	this._containedObject[ZaDomain.A2_isTestingGAL] = 0;
	this._containedObject[ZaDomain.A2_isTestingSync] = 0;
	this._containedObject[ZaDomain.A2_isTestingAuth] = 0;
	
	this._containedObject[ZaDomain.A_NotebookTemplateFolder]=entry[ZaDomain.A_NotebookTemplateFolder];
	this._containedObject[ZaDomain.A_NotebookTemplateDir]=entry[ZaDomain.A_NotebookTemplateDir];	
	this._containedObject[ZaDomain.A2_new_gal_sync_account_name]=entry[ZaDomain.A2_new_gal_sync_account_name];
	this._containedObject[ZaDomain.A2_new_internal_gal_ds_name]=entry[ZaDomain.A2_new_internal_gal_ds_name];
	this._containedObject[ZaDomain.A2_new_external_gal_ds_name]=entry[ZaDomain.A2_new_external_gal_ds_name];
	this._containedObject[ZaDomain.A2_create_gal_acc] = "TRUE";
	this._containedObject.notebookAcls = {};

	if(entry.rights)
		this._containedObject.rights = entry.rights;

	if(entry.setAttrs)
		this._containedObject.setAttrs = entry.setAttrs;
	
	if(entry.getAttrs)
		this._containedObject.getAttrs = entry.getAttrs;
		
	if(entry._defaultValues)
		this._containedObject._defaultValues = entry._defaultValues;


	if(entry.notebookAcls) {
		for(var gt in entry.notebookAcls) {
			if(!(entry.notebookAcls[gt] instanceof Array)) {
				this._containedObject.notebookAcls[gt] = {r:0,w:0,i:0,d:0,a:0,x:0};
				for (var a in entry.notebookAcls[gt]) {
					this._containedObject.notebookAcls[gt][a] = entry.notebookAcls[gt][a];
				}
			} else {
				this._containedObject.notebookAcls[gt] = [];
				var cnt = entry.notebookAcls[gt].length;
				for(var i = 0; i < cnt; i++) {
					var aclObj = entry.notebookAcls[gt][i];
					var _newAclObj = {};
					_newAclObj.name = aclObj.name;
					_newAclObj.acl = {r:0,w:0,i:0,d:0,a:0,x:0};
					for (var a in aclObj.acl) {
						_newAclObj.acl[a] = aclObj.acl[a];
					}					
					this._containedObject.notebookAcls[gt][i] = _newAclObj;
				}
			}
		}
	}	
	this._containedObject[ZaModel.currentStep] = 1;
	this._localXForm.setInstance(this._containedObject);	
}

/**
* static change handlers for the form
**/
ZaApplianceDomainXWizard.onGALServerTypeChange =
function (value, event, form) {
	if(value == "ad") {
		form.getModel().setInstanceValue(form.getInstance(),ZaDomain.A_GalLdapFilter,"ad");
		form.getModel().setInstanceValue(form.getInstance(),ZaDomain.A_zimbraGalAutoCompleteLdapFilter,"adAutoComplete");		
	} else {
		form.getModel().setInstanceValue(form.getInstance(),ZaDomain.A_GalLdapFilter,"");
		form.getModel().setInstanceValue(form.getInstance(),ZaDomain.A_zimbraGalAutoCompleteLdapFilter,"(|(cn=%s*)(sn=%s*)(gn=%s*)(mail=%s*))");		
	}
	this.setInstanceValue(value);	
}


ZaApplianceDomainXWizard.onGalModeChange = 
function (value, event, form) {
	this.setInstanceValue(value);
	if(value != "zimbra") {
		form.getModel().setInstanceValue(form.getInstance(),ZaDomain.A_GalLdapFilter,"");
		if(AjxUtil.isEmpty(form.getModel().getInstanceValue(form.getInstance(),ZaDomain.A_GALServerType))) {
			form.getModel().setInstanceValue(form.getInstance(),ZaDomain.A_GALServerType,"ldap");
		}
		if(AjxUtil.isEmpty(form.getModel().getInstanceValue(form.getInstance(),ZaDomain.A_GalLdapSearchBase))) {
			if(!AjxUtil.isEmpty(form.getModel().getInstanceValue(form.getInstance(),ZaDomain.A_domainName))) {
				var parts = form.getModel().getInstanceValue(form.getInstance(),ZaDomain.A_domainName).split(".");
				var szSearchBase = "";
				var coma = "";
				for(var ix in parts) {
					szSearchBase += coma;
				 	szSearchBase += "dc=";
				 	szSearchBase += parts[ix];
					var coma = ",";
				}
				form.getModel().setInstanceValue(form.getInstance(),ZaDomain.A_GalLdapSearchBase,szSearchBase);
			}
		}
	}
}

ZaApplianceDomainXWizard.onGALSyncServerTypeChange =
function (value, event, form) {
	if(value == "ad") {
		form.getModel().setInstanceValue(form.getInstance(),ZaDomain.A_zimbraGalSyncLdapFilter,"ad");
	} 
	this.setInstanceValue(value);	
}

ZaApplianceDomainXWizard.onGALSyncChange =
function (value, event, form) {
	this.setInstanceValue(value);
	
	if(value=='FALSE') {
		if(form.getModel().getInstanceValue(form.getInstance(),ZaDomain.A_zimbraGalSyncLdapFilter) == "ad") {
			form.getModel().setInstanceValue(form.getInstance(),ZaDomain.A_GALSyncServerType,"ad");
		} else if(AjxUtil.isEmpty(form.getModel().getInstanceValue(form.getInstance(),ZaDomain.A_GALSyncServerType))) {
			form.getModel().setInstanceValue(form.getInstance(),ZaDomain.A_GALSyncServerType,"ldap");
		}
	} 
}

ZaApplianceDomainXWizard.testSyncSettings = 
function () {
	var instance = this.getInstance();
	this.getModel().setInstanceValue(instance,ZaDomain.A2_isTestingSync,1);
	var callback = new AjxCallback(this, ZaApplianceDomainXWizard.checkSyncConfigCallBack);
	ZaDomain.testSyncSettings(instance, callback);	
}

ZaApplianceDomainXWizard.checkSyncConfigCallBack = 
	function (arg) {
		if(!arg)
			return;
		
		var instance = this.getInstance();
		this.getModel().setInstanceValue(instance,ZaDomain.A2_isTestingSync,0);

		if(arg.isException()) {
			var msg = [arg.getException().detail,arg.getException().msg,arg.getException().trace].join("\n");
			this.getModel().setInstanceValue(instance,ZaDomain.A_GALSyncTestResultCode,arg.getException().code);
			this.getModel().setInstanceValue(instance,ZaDomain.A_GALSyncTestMessage,msg);
		} else {
			var searchResponse = arg.getResponse().Body.CheckGalConfigResponse;
			if(searchResponse) {
				this.getModel().setInstanceValue(instance,ZaDomain.A_GALSyncTestResultCode,searchResponse.code[0]._content);	
				if(searchResponse.code[0]._content != ZaDomain.Check_OK) {
					this.getModel().setInstanceValue(instance,ZaDomain.A_GALSyncTestMessage,searchResponse.message[0]._content);
				}				
			}
		}

		this.getForm().parent.goPage(ZaApplianceDomainXWizard.SYNC_TEST_RESULT_STEP);
}

ZaApplianceDomainXWizard.testGALSettings =
function () {
	var instance = this.getInstance();
	this.getModel().setInstanceValue(instance,ZaDomain.A2_isTestingGAL,1);
	var callback = new AjxCallback(this, ZaApplianceDomainXWizard.checkGALConfigCallBack);
	ZaDomain.testGALSettings(instance, callback, instance[ZaDomain.A_GALSampleQuery]);		
}
/**
* Callback function invoked by Asynchronous CSFE command when "check" call returns
**/
ZaApplianceDomainXWizard.checkGALConfigCallBack = 
function (arg) {
	if(!arg)
		return;
	
	var instance = this.getInstance();
	this.getModel().setInstanceValue(instance,ZaDomain.A2_isTestingGAL,0);

	if(arg.isException()) {
		var msg = [arg.getException().detail,arg.getException().msg,arg.getException().trace].join("\n");
		this.getModel().setInstanceValue(instance,ZaDomain.A_GALSearchTestResultCode,arg.getException().code);
		this.getModel().setInstanceValue(instance,ZaDomain.A_GALSearchTestMessage,msg);
		this.getModel().setInstanceValue(instance,ZaDomain.A_GALTestSearchResults,null);
	} else {
		var searchResponse = arg.getResponse().Body.CheckGalConfigResponse;
		if(searchResponse) {
			this.getModel().setInstanceValue(instance,ZaDomain.A_GALSearchTestResultCode,searchResponse.code[0]._content); 
			if(searchResponse.code[0]._content != ZaDomain.Check_OK) {
				this.getModel().setInstanceValue(instance,ZaDomain.A_GALSearchTestMessage,searchResponse.message[0]._content);
				this.getModel().setInstanceValue(instance,ZaDomain.A_GALTestSearchResults,null);
			} else {
				var searchResults = new Array();
				if(searchResponse.cn && searchResponse.cn.length) {
					var len = searchResponse.cn.length;
					for (var ix=0;ix<len;ix++) {
						var cnObject = new Object();
						if(searchResponse.cn[ix]._attrs) {
							for (var a in searchResponse.cn[ix]._attrs) {
								cnObject[a] = searchResponse.cn[ix]._attrs[a];
							}
							searchResults.push(cnObject);						
						}
					}
				}
				this.getModel().setInstanceValue(instance,ZaDomain.A_GALTestSearchResults,searchResults);
			}
		}
	}

	this.getForm().parent.goPage(ZaApplianceDomainXWizard.GAL_TEST_RESULT_STEP);
}


/**
* Eevent handlers for form items
**/
ZaApplianceDomainXWizard.onAuthMechChange = 
function (value, event, form) {
	this.setInstanceValue(value);
	if(value == ZaDomain.AuthMech_ad) {
		if(!form.getInstance().attrs[ZaDomain.A_AuthADDomainName]) {
			form.getInstance().attrs[ZaDomain.A_AuthADDomainName] = form.getInstance().attrs[ZaDomain.A_domainName];
		}
	}
}

ZaApplianceDomainXWizard.onCOSChanged = 
function(value, event, form) {
	if(ZaItem.ID_PATTERN.test(value))  {
		this.setInstanceValue(value);
	} else {
		var cos = ZaCos.getCosByName(value, form.parent._app);
		if(cos) {
			//value = form.getInstance()._defaultValues.id;
			value = cos.id;
		} 
	}
	this.setInstanceValue(value);
	return value;
}

ZaApplianceDomainXWizard.testAuthSettings =
function () {
	var instance = this.getInstance();
	if(instance.attrs[ZaDomain.A_AuthMech] == ZaDomain.AuthMech_ad) {
		this.getModel().setInstanceValue(instance,ZaDomain.A_AuthLdapUserDn,"%u@"+instance.attrs[ZaDomain.A_AuthADDomainName])
	}
	var callback = new AjxCallback(this, ZaApplianceDomainXWizard.checkAuthCallBack);
	ZaDomain.testAuthSettings(instance, callback);	
}

/**
* Callback function invoked by Asynchronous CSFE command when "check" call returns
**/
ZaApplianceDomainXWizard.checkAuthCallBack = 
function (arg) {

	if(!arg)
		return;
	var instance = this.getInstance();
	if(arg.isException()) {
		this.getModel().setInstanceValue(instance,ZaDomain.A_AuthTestResultCode,arg.getException().code);
		this.getModel().setInstanceValue(instance,ZaDomain.A_AuthTestMessage,arg.getException().detail+"\n"+arg.getException().msg);
	} else {
		var response = arg.getResponse().Body.CheckAuthConfigResponse;
		this.getModel().setInstanceValue(instance,ZaDomain.A_AuthTestResultCode,response.code[0]._content);
		if(instance[ZaDomain.A_AuthTestResultCode] != ZaDomain.Check_OK) {
			this.getModel().setInstanceValue(instance,ZaDomain.A_AuthTestMessage,response.message[0]._content);		
			if(response.bindDn != null) {
				this.getModel().setInstanceValue(instance,ZaDomain.A_AuthComputedBindDn,response.bindDn[0]._content);		
			} else {
				this.getModel().setInstanceValue(instance,ZaDomain.A_AuthComputedBindDn,"");
			}
		}
	}	
	this.getForm().parent.goPage(ZaApplianceDomainXWizard.AUTH_TEST_RESULT_STEP);
}


/**
* Overwritten methods that control wizard's flow (open, go next,go previous, finish)
**/
ZaApplianceDomainXWizard.prototype.popup = 
function (loc) {
	ZaXWizardDialog.prototype.popup.call(this, loc);
	this._button[DwtWizardDialog.NEXT_BUTTON].setText(AjxMsg._next);
	this._button[DwtWizardDialog.NEXT_BUTTON].setEnabled(true);
	this._button[DwtWizardDialog.FINISH_BUTTON].setEnabled(false);
	this._button[DwtWizardDialog.PREV_BUTTON].setEnabled(false);	
}

ZaApplianceDomainXWizard.prototype.goPrev =
function () {
	if (this._containedObject[ZaModel.currentStep] == ZaApplianceDomainXWizard.AUTH_MODE_STEP && this._containedObject.attrs[ZaDomain.A_zimbraGalMode]==ZaDomain.GAL_Mode_internal) {
		this.goPage(ZaApplianceDomainXWizard.GALMODE_STEP);
		this.changeButtonStateForStep(ZaApplianceDomainXWizard.GALMODE_STEP);		
	}  else if(this._containedObject[ZaModel.currentStep] == ZaApplianceDomainXWizard.VHOST_STEP) {
		if(this._containedObject.attrs[ZaDomain.A_AuthMech] == ZaDomain.AuthMech_zimbra) {
			this.goPage(ZaApplianceDomainXWizard.AUTH_MODE_STEP); //skip all auth configuration
		} else {
			this.goPage(ZaApplianceDomainXWizard.AUTH_CONFIG_SUM_STEP);
		}
	} else if(this._containedObject[ZaModel.currentStep] == ZaApplianceDomainXWizard.CONFIG_COMPLETE_STEP) {
		if (this._containedObject[ZaDomain.A_CreateNotebook] == "TRUE") {
			this.goPage(ZaApplianceDomainXWizard.NOTEBOOK_ACL_STEP);
			this.changeButtonStateForStep(ZaApplianceDomainXWizard.NOTEBOOK_ACL_STEP);	
		}else{
			this.goPage(ZaApplianceDomainXWizard.NOTEBOOK_STEP);
			this.changeButtonStateForStep(ZaApplianceDomainXWizard.NOTEBOOK_STEP);
		}
	} else if (this._containedObject[ZaModel.currentStep] == ZaApplianceDomainXWizard.AUTH_CONFIG_SUM_STEP) {
		if(this._containedObject.attrs[ZaDomain.A_AuthMech] == ZaDomain.AuthMech_zimbra) {
			this.goPage(ZaApplianceDomainXWizard.AUTH_MODE_STEP); //skip all auth configuration
		} else if(this._containedObject.attrs[ZaDomain.A_AuthMech] == ZaDomain.AuthMech_ad) {
			this.goPage(ZaApplianceDomainXWizard.AUTH_MODE_STEP);
		}  else if(this._containedObject.attrs[ZaDomain.A_AuthMech] == ZaDomain.AuthMech_ldap) {
			this.goPage(ZaApplianceDomainXWizard.AUTH_CONFIG_STEP_2);
		}
	} else {
		this.changeButtonStateForStep(this._containedObject[ZaModel.currentStep]-1);
		this.goPage(this._containedObject[ZaModel.currentStep]-1);
	}
}

ZaApplianceDomainXWizard.prototype.goNext = 
function() {
	if(this._containedObject[ZaModel.currentStep] == ZaApplianceDomainXWizard.GALMODE_STEP) {
		if(this._containedObject.attrs[ZaDomain.A_zimbraGalMode]!=ZaDomain.GAL_Mode_internal) {	
			//check that Filter is provided and at least one server
			if(!this._containedObject.attrs[ZaDomain.A_GalLdapFilter]) {
				ZaApp.getInstance().getCurrentController().popupErrorDialog(ZaMsg.ERROR_SEARCH_FILTER_REQUIRED);			
				return;
			}
			if(!this._containedObject.attrs[ZaDomain.A_GalLdapURL] || this._containedObject.attrs[ZaDomain.A_GalLdapURL].length < 1) {
				ZaApp.getInstance().getCurrentController().popupErrorDialog(ZaMsg.ERROR_LDAP_URL_REQUIRED);					
				return;
			}
			if(!this._containedObject[ZaDomain.A2_new_external_gal_ds_name] || this._containedObject[ZaDomain.A2_new_external_gal_ds_name].length < 1) {
				ZaApp.getInstance().getCurrentController().popupErrorDialog(ZaMsg.ERROR_EXTERNAL_GAL_DS_NAME_REQUIRED);					
				return;
			}
		} 
		
	}
	if (this._containedObject[ZaModel.currentStep] == ZaApplianceDomainXWizard.GENERAL_STEP) {
		this._containedObject.attrs[ZaDomain.A_AuthADDomainName] = this._containedObject.attrs[ZaDomain.A_domainName];
		this.changeButtonStateForStep(ZaApplianceDomainXWizard.GALMODE_STEP);
		this.goPage(ZaApplianceDomainXWizard.GALMODE_STEP);		
	} else if(this._containedObject[ZaModel.currentStep] == ZaApplianceDomainXWizard.GALMODE_STEP && this._containedObject.attrs[ZaDomain.A_zimbraGalMode]==ZaDomain.GAL_Mode_internal) {
		this.changeButtonStateForStep(ZaApplianceDomainXWizard.AUTH_MODE_STEP);
		this.goPage(ZaApplianceDomainXWizard.AUTH_MODE_STEP);
	} else if(this._containedObject[ZaModel.currentStep] == ZaApplianceDomainXWizard.GAL_CONFIG_STEP_2) {
		//clear the password if the checkbox is unchecked
		if(this._containedObject.attrs[ZaDomain.A_UseBindPassword]=="FALSE") {
			this._containedObject.attrs[ZaDomain.A_GalLdapBindPassword] = null;
			this._containedObject.attrs[ZaDomain.A_GalLdapBindPasswordConfirm] = null;
			this._containedObject.attrs[ZaDomain.A_GalLdapBindDn] = null;
		}
		//check that passwords match
		if(this._containedObject.attrs[ZaDomain.A_GalLdapBindPassword]!=this._containedObject.attrs[ZaDomain.A_GalLdapBindPasswordConfirm]) {
			ZaApp.getInstance().getCurrentController().popupErrorDialog(ZaMsg.ERROR_PASSWORD_MISMATCH);
			return false;
		}
		this.goPage(ZaApplianceDomainXWizard.GAL_CONFIG_SUM_STEP);
		this.changeButtonStateForStep(ZaApplianceDomainXWizard.GAL_CONFIG_SUM_STEP);		
	} else if(this._containedObject[ZaModel.currentStep] == ZaApplianceDomainXWizard.GAL_CONFIG_SUM_STEP) {
		this._localXForm.setInstanceValue(ZaDomain.Check_SKIPPED,ZaDomain.A_GALSearchTestResultCode);
		this.goPage(ZaApplianceDomainXWizard.GAL_TEST_RESULT_STEP);

	} else if (this._containedObject[ZaModel.currentStep] == ZaApplianceDomainXWizard.AUTH_MODE_STEP) {
		if(this._containedObject.attrs[ZaDomain.A_AuthMech]==ZaDomain.AuthMech_zimbra) {
			this.goPage(ZaApplianceDomainXWizard.VHOST_STEP);		
			this.changeButtonStateForStep(ZaApplianceDomainXWizard.VHOST_STEP);
		} else {
			if(!this._containedObject.attrs[ZaDomain.A_AuthLdapURL]) {
				ZaApp.getInstance().getCurrentController().popupErrorDialog(ZaMsg.ERROR_LDAP_URL_REQUIRED);
				return false;
			}			
			if(this._containedObject.attrs[ZaDomain.A_AuthMech]==ZaDomain.AuthMech_ad) {
				var temp = this._containedObject.attrs[ZaDomain.A_AuthLdapURL].join(" ");
				if(this._containedObject.attrs[ZaDomain.A_zimbraAuthLdapStartTlsEnabled] == "TRUE") {
					//check that we don't have ldaps://
					if(temp.indexOf("ldaps://") > -1) {
						ZaApp.getInstance().getCurrentController().popupWarningDialog(ZaMsg.Domain_WarningStartTLSIgnored)
					}		
				}		
				this.goPage(ZaApplianceDomainXWizard.AUTH_CONFIG_SUM_STEP);
				this.changeButtonStateForStep(ZaApplianceDomainXWizard.AUTH_CONFIG_SUM_STEP);			
			} else {
				this.goPage(ZaApplianceDomainXWizard.AUTH_CONFIG_STEP_2);
				this.changeButtonStateForStep(ZaApplianceDomainXWizard.AUTH_CONFIG_STEP_2);			
			}			
		}
	}  else if (this._containedObject[ZaModel.currentStep] == ZaApplianceDomainXWizard.AUTH_CONFIG_STEP_2) {
			//clear the password if the checkbox is unchecked
		if(this._containedObject[ZaDomain.A_AuthUseBindPassword]=="FALSE") {
			this._containedObject.attrs[ZaDomain.A_AuthLdapSearchBindDn] = null;
			this._containedObject.attrs[ZaDomain.A_AuthLdapSearchBindPassword] = null;
			this._containedObject[ZaDomain.A_AuthLdapSearchBindPasswordConfirm] = null;
		}
		//check that passwords match
		if(this._containedObject.attrs[ZaDomain.A_AuthLdapSearchBindPassword]!=this._containedObject[ZaDomain.A_AuthLdapSearchBindPasswordConfirm]) {
			ZaApp.getInstance().getCurrentController().popupErrorDialog(ZaMsg.ERROR_PASSWORD_MISMATCH);
			return false;
		}
		this.goPage(ZaApplianceDomainXWizard.AUTH_CONFIG_SUM_STEP);
		//this.changeButtonStateForStep(ZaApplianceDomainXWizard.AUTH_CONFIG_SUM_STEP);
	} else if(this._containedObject[ZaModel.currentStep] == ZaApplianceDomainXWizard.AUTH_CONFIG_SUM_STEP) {
		this._localXForm.setInstanceValue(ZaDomain.Check_SKIPPED,ZaDomain.A_AuthTestResultCode);
		this.goPage(ZaApplianceDomainXWizard.AUTH_TEST_RESULT_STEP);
 		//this.testAuthSettings();
		//this.changeButtonStateForStep(ZaApplianceDomainXWizard.AUTH_TEST_STEP);
	} else if(this._containedObject[ZaModel.currentStep] == ZaApplianceDomainXWizard.NOTEBOOK_STEP) {
		if (this._containedObject[ZaDomain.A_CreateNotebook] != "TRUE") {
			this.goPage(this._containedObject[ZaModel.currentStep] + 2);
			this.changeButtonStateForStep(this._containedObject[ZaModel.currentStep]);
		} else if(this._containedObject[ZaDomain.A_NotebookAccountPassword] != this._containedObject[ZaDomain.A_NotebookAccountPassword2]) {
			ZaApp.getInstance().getCurrentController().popupErrorDialog(ZaMsg.ERROR_PASSWORD_MISMATCH);
		} else {		
			this.goPage(this._containedObject[ZaModel.currentStep] + 1);
			this.changeButtonStateForStep(this._containedObject[ZaModel.currentStep]);
		}
	} else {
		this.goPage(this._containedObject[ZaModel.currentStep] + 1);
		this.changeButtonStateForStep(this._containedObject[ZaModel.currentStep]);
	}
}

ZaApplianceDomainXWizard.getGalSyncLdapFilterEnabled = function () {
	var val1 = this.getModel().getInstanceValue(this.getInstance(),ZaDomain.A_GALSyncUseGALSearch);
	var val2 = this.getModel().getInstanceValue(this.getInstance(),ZaDomain.A_GALSyncServerType);
	return (val1 == 'FALSE' && val2=='ldap');	
}

ZaApplianceDomainXWizard.getGalSyncConfigSeparate = function () {
	var val1 = this.getModel().getInstanceValue(this.getInstance(),ZaDomain.A_GALSyncUseGALSearch);
	return (val1 == 'FALSE');	
}

ZaApplianceDomainXWizard.isDomainModeNotInternal = function () {
	return (this.getInstanceValue(ZaDomain.A_zimbraGalMode) !=ZaDomain.GAL_Mode_internal);
}

ZaApplianceDomainXWizard.isDomainModeNotExternal = function () {
	return (this.getInstanceValue(ZaDomain.A_zimbraGalMode) !=ZaDomain.GAL_Mode_external);
}

ZaApplianceDomainXWizard.isAuthMechNotZimbra = function () {
	return (this.getInstanceValue(ZaDomain.A_AuthMech) != ZaDomain.AuthMech_zimbra);
}

ZaApplianceDomainXWizard.myXFormModifier = function(xFormObject, entry) {
	var resultHeaderList = new Array();
	resultHeaderList[0] = new ZaListHeaderItem("email", ZaMsg.ALV_Name_col, null, "116px", null, "email", true, true);
	resultHeaderList[1] = new ZaListHeaderItem("fullName", ZaMsg.ALV_FullName_col, null, "auto", null, "fullName", true, true);
	
	xFormObject.items = [
		{type:_OUTPUT_, colSpan:2, align:_CENTER_, valign:_TOP_, ref:ZaModel.currentStep, choices:this.stepChoices,valueChangeEventSources:[ZaModel.currentStep]},
		{type:_SEPARATOR_, align:_CENTER_, valign:_TOP_},
		{type:_SPACER_,  align:_CENTER_, valign:_TOP_},		
		{type: _SWITCH_,width:650,
			items: [
				{type:_CASE_, caseKey:ZaApplianceDomainXWizard.GENERAL_STEP, colSizes:["220px","430px"],numCols:2,
					items: [
						{ref:ZaDomain.A_domainName, type:_TEXTFIELD_, label:ZaMsg.Domain_DomainName,labelLocation:_LEFT_, width:200},
						{ref:ZaDomain.A_zimbraPublicServiceHostname, type:_TEXTFIELD_, label:ZaMsg.Domain_zimbraPublicServiceHostname,labelLocation:_LEFT_, width:200},						
						{ type: _DWT_ALERT_,containerCssStyle: "padding-bottom:0px",style: DwtAlert.INFO,
								iconVisible: true,content: ZaMsg.Domain_InboundSMTPNote,colSpan:"*"},
						{type:_GROUP_,colSpan:"2", colSizes:["200px","250px", "150px"],numCols:2,id:"dns_check_group",items:[
						
							{ref: ZaDomain.A_zimbraDNSCheckHostname, type:_SUPERWIZ_TEXTFIELD_, textFieldWidth:200,
		 						label:null,txtBoxLabel:ZaMsg.Domain_zimbraDNSCheckHostname, resetToSuperLabel:ZaMsg.NAD_ResetToGlobal}/*, {type:_CELLSPACER_}*/	
						]},	
						{ref:ZaDomain.A_description, type:_TEXTFIELD_, label:ZaMsg.NAD_Description, labelLocation:_LEFT_, width:250},
						{ref:ZaDomain.A_domainDefaultCOSId, type:_DYNSELECT_, 
							toolTipContent:ZaMsg.tt_StartTypingCOSName,
							label:ZaMsg.Domain_DefaultCOS, labelLocation:_LEFT_, 
							onChange:ZaApplianceDomainXWizard.onCOSChanged,
							dataFetcherMethod:ZaSearch.prototype.dynSelectSearchCoses,
							choices:this.cosChoices,
							dataFetcherClass:ZaSearch,
							emptyText:ZaMsg.enterSearchTerm,
							editable:true,
							getDisplayValue:function(newValue) {
								// dereference through the choices array, if provided
								//newValue = this.getChoiceLabel(newValue);
								if(ZaItem.ID_PATTERN.test(newValue)) {
									var cos = ZaCos.getCosById(newValue, this.getForm().parent._app);
									if(cos)
										newValue = cos.name;
								} 
								if (newValue == null) {
									newValue = "";
								} else {
									newValue = "" + newValue;
								}
								return newValue;
							}
						},
						{ref:ZaDomain.A_notes, type:_TEXTAREA_, label:ZaMsg.NAD_Notes, labelLocation:_LEFT_, labelCssStyle:"vertical-align:top", width:250}
					]
				},
				{type:_CASE_, caseKey:ZaApplianceDomainXWizard.GALMODE_STEP,numCols:2,colSizes:["220px","430px"],
					items: [
						{ref:ZaDomain.A_zimbraGalMode, type:_OSELECT1_, label:ZaMsg.Domain_GalMode, labelLocation:_LEFT_, choices:this.GALModes, onChange:ZaApplianceDomainXWizard.onGalModeChange},
						{type:_GROUP_, colSpan:2,numCols:2,colSizes:["220px","430px"],
							visibilityChangeEventSources:[ZaDomain.A_zimbraGalMode],
							visibilityChecks:[ZaApplianceDomainXWizard.isDomainModeNotInternal],
							cssStyle:"overflow:auto",
							items: [
								{ref:ZaDomain.A_GALServerType, type:_OSELECT1_, label:ZaMsg.Domain_GALServerType, labelLocation:_LEFT_, choices:this.GALServerTypes, onChange:ZaApplianceDomainXWizard.onGALServerTypeChange},
								{type:_GROUP_, numCols:6, colSpan:6,label:"   ",labelLocation:_LEFT_,
									items: [
										{type:_OUTPUT_, label:null, labelLocation:_NONE_, value:" ", width:"35px"},
										{type:_OUTPUT_, label:null, labelLocation:_NONE_, value:ZaMsg.Domain_GALServerName, width:"200px"},
										{type:_OUTPUT_, label:null, labelLocation:_NONE_, value:" ", width:"5px"},									
										{type:_OUTPUT_, label:null, labelLocation:_NONE_, value:ZaMsg.Domain_GALServerPort,  width:"40px"},	
										{type:_OUTPUT_, label:null, labelLocation:_NONE_, value:ZaMsg.Domain_GALUseSSL, width:"40px"}									
									]
								},
								{ref:ZaDomain.A_GalLdapURL, type:_REPEAT_, label:ZaMsg.Domain_GalLdapURL, repeatInstance:"", showAddButton:true, showRemoveButton:true,  
									addButtonLabel:ZaMsg.Domain_AddURL, 
									removeButtonLabel:ZaMsg.Domain_REPEAT_REMOVE,
									showAddOnNextRow:true,
									items: [
										{ref:".", type:_LDAPURL_, label:null,ldapSSLPort:"3269",ldapPort:"3268",  labelLocation:_NONE_}
									]
								},
								{ref:ZaDomain.A_GalLdapFilter, type:_TEXTAREA_, width:380, height:40, label:ZaMsg.Domain_GalLdapFilter, labelLocation:_LEFT_, 
									enableDisableChecks:[[XForm.checkInstanceValue,ZaDomain.A_GALServerType,ZaDomain.GAL_ServerType_ldap]],
									enableDisableChangeEventSources:[ZaDomain.A_GALServerType]
									
								},
								{ref:ZaDomain.A_zimbraGalAutoCompleteLdapFilter, type:_TEXTAREA_, width:380, height:40, label:ZaMsg.Domain_zimbraGalAutoCompleteLdapFilter, labelLocation:_LEFT_, 
									enableDisableChecks:[[XForm.checkInstanceValue,ZaDomain.A_GALServerType,ZaDomain.GAL_ServerType_ldap]],
									enableDisableChangeEventSources:[ZaDomain.A_GALServerType]
									
								},						
								{ref:ZaDomain.A_GalLdapSearchBase, type:_TEXTAREA_, width:380, height:40, label:ZaMsg.Domain_GalLdapSearchBase, labelLocation:_LEFT_}
							]
						}
					]
				},

				{type:_CASE_, caseKey:ZaApplianceDomainXWizard.GAL_CONFIG_STEP_2, colSizes:["220px","430px"],numCols:2,
					visibilityChangeEventSources:[ZaModel.currentStep],
					visibilityChecks:[Case_XFormItem.prototype.isCurrentTab,ZaApplianceDomainXWizard.isDomainModeNotInternal],
					
					items: [
						{ref:ZaDomain.A_UseBindPassword, type:_CHECKBOX_, label:ZaMsg.Domain_UseBindPassword, labelLocation:_LEFT_,trueValue:"TRUE", falseValue:"FALSE",labelCssClass:"xform_label", align:_LEFT_},
						{ref:ZaDomain.A_GalLdapBindDn, type:_TEXTFIELD_, label:ZaMsg.Domain_GalLdapBindDn, labelLocation:_LEFT_, 
							enableDisableChecks:[[XForm.checkInstanceValue,ZaDomain.A_UseBindPassword,"TRUE"]],
							enableDisableChangeEventSources:[ZaDomain.A_UseBindPassword]
							
						},
						{ref:ZaDomain.A_GalLdapBindPassword, type:_SECRET_, label:ZaMsg.Domain_GalLdapBindPassword, labelLocation:_LEFT_, 
							enableDisableChecks:[[XForm.checkInstanceValue,ZaDomain.A_UseBindPassword,"TRUE"]],
							enableDisableChangeEventSources:[ZaDomain.A_UseBindPassword]
							
						},
						{ref:ZaDomain.A_GalLdapBindPasswordConfirm, type:_SECRET_, label:ZaMsg.Domain_GalLdapBindPasswordConfirm, labelLocation:_LEFT_, 
							enableDisableChecks:[[XForm.checkInstanceValue,ZaDomain.A_UseBindPassword,"TRUE"]],
							enableDisableChangeEventSources:[ZaDomain.A_UseBindPassword]							
							
						}														
					]			
				}, 				
				{type:_CASE_, caseKey:ZaApplianceDomainXWizard.GAL_CONFIG_SUM_STEP,numCols:2,colSizes:["220px","430px"],
					items: [
						//search
						{type:_GROUP_,
							visibilityChecks:[ZaApplianceDomainXWizard.isDomainModeNotInternal,[XForm.checkInstanceValue,ZaDomain.A2_isTestingGAL,0]],
							visibilityChangeEventSources:[ZaDomain.A_zimbraGalMode,ZaDomain.A2_isTestingGAL],
							useParentTable:false,
							numCols:2,colSpan:2,
							items: [
								{ref:ZaDomain.A_zimbraGalMode, type:_OUTPUT_, label:ZaMsg.Domain_GalMode, choices:this.GALModes,
									visibilityChecks:[[XForm.checkInstanceValue,ZaDomain.A2_isTestingGAL,0]],
									visibilityChangeEventSources:[ZaDomain.A2_isTestingGAL]	
								},
								{ref:ZaDomain.A_zimbraGalMaxResults, type:_OUTPUT_, label:ZaMsg.LBL_zimbraGalMaxResults,
									visibilityChecks:[[XForm.checkInstanceValue,ZaDomain.A2_isTestingGAL,0]],
									visibilityChangeEventSources:[ZaDomain.A2_isTestingGAL]
								},							        
								{ref:ZaDomain.A_GALServerType, type:_OUTPUT_, label:ZaMsg.Domain_GALServerType, choices:this.GALServerTypes, labelLocation:_LEFT_, bmolsnr:true},
								{ref:ZaDomain.A_GalLdapURL, type:_REPEAT_, label:ZaMsg.Domain_GalLdapURL+":", labelLocation:_LEFT_,showAddButton:false, bmolsnr:true, showRemoveButton:false,
									items:[
										{type:_OUTPUT_, ref:".", label:null,labelLocation:_NONE_,bmolsnr:true}
									]
								},	
								{ref:ZaDomain.A_GalLdapFilter, type:_OUTPUT_, label:ZaMsg.Domain_GalLdapFilter, labelLocation:_LEFT_,required:true, 
									visibilityChecks:[[XForm.checkInstanceValue,ZaDomain.A_GALServerType,ZaDomain.GAL_ServerType_ldap]],
									visibilityChangeEventSources:[ZaDomain.GAL_ServerType_ldap], bmolsnr:true									
									
								},
								{ref:ZaDomain.A_GalLdapSearchBase, type:_OUTPUT_, label:ZaMsg.Domain_GalLdapSearchBase, labelLocation:_LEFT_, bmolsnr:true},
								{ref:ZaDomain.A_UseBindPassword, type:_OUTPUT_, label:ZaMsg.Domain_UseBindPassword, labelLocation:_LEFT_,trueValue:"TRUE", falseValue:"FALSE", bmolsnr:true},
								{ref:ZaDomain.A_GalLdapBindDn, type:_OUTPUT_, label:ZaMsg.Domain_GalLdapBindDn, labelLocation:_LEFT_, 
									visibilityChecks:[[XForm.checkInstanceValue,ZaDomain.A_UseBindPassword,"TRUE"]],
									visibilityChangeEventSources:[ZaDomain.A_UseBindPassword], bmolsnr:true									
								},
								{ref:ZaDomain.A_GALSampleQuery, type:_INPUT_, label:ZaMsg.Domain_GALSampleSearchName, labelLocation:_LEFT_, labelWrap:true, cssStyle:"width:100px;", bmolsnr:true},								
								{type:_CELLSPACER_},
								{type:_DWT_BUTTON_, 
									enableDisableChecks:[[XForm.checkInstanceValueNot,ZaDomain.A_GALSampleQuery," "],
									                     [XForm.checkInstanceValueNotEmty,ZaDomain.A_GALSampleQuery]],
									enableDisableChangeEventSources:[ZaDomain.A_GALSampleQuery],
									onActivate:"ZaApplianceDomainXWizard.testGALSettings.call(this)", 
									label:ZaMsg.Domain_GALTestSettings, 
									visibilityChecks:[],					
									valign:_BOTTOM_,width:"100px"
								}
							]
						},
						{type:_DWT_ALERT_,content:ZaMsg.Domain_GALTestingInProgress,
							ref:null,
							colSpan:"2",
							iconVisible: true,
							align:_CENTER_,				
							style: DwtAlert.INFORMATION,
							visibilityChecks:[[XForm.checkInstanceValue,ZaDomain.A2_isTestingGAL,1]],
							visibilityChangeEventSources:[ZaDomain.A2_isTestingGAL]
						}						
					]
				},
				{type:_CASE_, caseKey:ZaApplianceDomainXWizard.GAL_TEST_RESULT_STEP,numCols:2,colSizes:["220px","430px"],
					items: [
						{type:_GROUP_, 
							visibilityChecks:[[XForm.checkInstanceValue,ZaDomain.A_GALSearchTestResultCode,ZaDomain.Check_OK]] ,
							visibilityChangeEventSources:[ZaDomain.A_GALSearchTestResultCode],							
							numCols:2,
							items: [
								{type:_DWT_ALERT_,content:ZaMsg.Domain_GALSearchTestSuccessful,
									ref:null,
									colSpan:"2",
									iconVisible: false,
									align:_CENTER_,				
									style: DwtAlert.INFORMATION
								},										
								{type:_OUTPUT_, value:ZaMsg.Domain_GALSearchResult,  align:_CENTER_, colSpan:2, 
									visibilityChecks:[[XForm.checkInstanceValueNotEmty,ZaDomain.A_GALTestSearchResults]]
									
								},											
								{type:_SPACER_,  align:_CENTER_, valign:_TOP_, colSpan:"*"},	
								{ref: ZaDomain.A_GALTestSearchResults, type:_DWT_LIST_, height:"140px", width:"260px",colSpan:2,
			 				    	cssClass: "DLSource", forceUpdate: true, 
			 				    	widgetClass:ZaGalObjMiniListView, headerList:resultHeaderList,
			 				    	hideHeader:true
			 				    }
							]
						},
						{type:_GROUP_, 
							visibilityChecks:[[XForm.checkInstanceValueNot,ZaDomain.A_GALSearchTestResultCode,ZaDomain.Check_OK],
							                  [XForm.checkInstanceValueNot,ZaDomain.A_GALSearchTestResultCode,ZaDomain.Check_SKIPPED]],							
							visibilityChangeEventSources:[ZaDomain.A_GALSearchTestResultCode],						
							numCols:2,					
							items: [
							   {type:_DWT_ALERT_,content:ZaMsg.Domain_GALSearchTestFailed,
									ref:null,
									colSpan:"2",
									iconVisible: true,
									align:_CENTER_,				
									style: DwtAlert.WARNING
								},							
								{type:_OUTPUT_, ref:ZaDomain.A_GALSearchTestResultCode, label:ZaMsg.Domain_GALTestResult, choices:this.TestResultChoices},
								{type:_TEXTAREA_, ref:ZaDomain.A_GALSearchTestMessage, label:ZaMsg.Domain_GALTestMessage, height:"200px", width:"380px"}
							]
						},
						{type:_DWT_ALERT_,content:ZaMsg.Domain_GALSearchTestSkipped,
							ref:null,
							colSpan:"2",
							iconVisible: true,
							align:_CENTER_,				
							style: DwtAlert.WARNING,
							visibilityChecks:[[XForm.checkInstanceValue,ZaDomain.A_GALSearchTestResultCode,ZaDomain.Check_SKIPPED]],
							visibilityChangeEventSources:[ZaDomain.A_GALSearchTestResultCode]									
						},
					]
				},
				{type:_CASE_, caseKey:ZaApplianceDomainXWizard.AUTH_MODE_STEP, numCols:2,colSizes:["220px","430px"],					
					items:[
						{type:_OSELECT1_, label:ZaMsg.Domain_AuthMech, choices:this.AuthMechs, ref:ZaDomain.A_AuthMech, onChange:ZaApplianceDomainXWizard.onAuthMechChange},
						{type:_GROUP_, numCols:2,colSizes:["220px","auto"],colSpan:2,
							visibilityChecks:[[XForm.checkInstanceValue,ZaDomain.A_AuthMech,ZaDomain.AuthMech_ad]],
							visibilityChangeEventSources:[ZaDomain.A_AuthMech],
							items:[
								{ref:ZaDomain.A_AuthADDomainName, type:_TEXTFIELD_, label:ZaMsg.Domain_AuthADDomainName, labelLocation:_LEFT_},
								{type:_GROUP_, numCols:6, /*colSpan:2,*/label:"   ",labelLocation:_LEFT_,
									items: [
										{type:_OUTPUT_, label:null, labelLocation:_NONE_, value:" ", width:"35px"},
										{type:_OUTPUT_, label:null, labelLocation:_NONE_, value:ZaMsg.Domain_AuthADServerName, width:"200px"},
										{type:_OUTPUT_, label:null, labelLocation:_NONE_, value:" ", width:"5px"},									
										{type:_OUTPUT_, label:null, labelLocation:_NONE_, value:ZaMsg.Domain_AuthADServerPort,  width:"40px"},	
										{type:_OUTPUT_, label:null, labelLocation:_NONE_, value:ZaMsg.Domain_AuthADUseSSL, width:"40px"}									
									]
								},
								{ref:ZaDomain.A_AuthLdapURL, type:_REPEAT_, label:ZaMsg.Domain_AuthLdapURL, repeatInstance:"", showAddButton:true, showRemoveButton:true,  
									addButtonLabel:ZaMsg.Domain_AddURL, 
									showAddOnNextRow:true,	
									removeButtonLabel:ZaMsg.Domain_REPEAT_REMOVE,																						
									items: [
										{ref:".", type:_LDAPURL_, label:null, labelLocation:_NONE_,ldapSSLPort:"3269",ldapPort:"3268"}
									]
								}									
							]
						},
						{type:_GROUP_, numCols:2,colSizes:["220px","auto"],colSpan:2,
							visibilityChecks:[[XForm.checkInstanceValue,ZaDomain.A_AuthMech,ZaDomain.AuthMech_ldap]],
							visibilityChangeEventSources:[ZaDomain.A_AuthMech],
							items:[
								{type:_GROUP_, numCols:6, /*colSpan:2,*/label:"   ",labelLocation:_LEFT_,
									items: [
										{type:_OUTPUT_, label:null, labelLocation:_NONE_, value:" ", width:"35px"},
										{type:_OUTPUT_, label:null, labelLocation:_NONE_, value:ZaMsg.Domain_AuthLDAPServerName, width:"200px"},
										{type:_OUTPUT_, label:null, labelLocation:_NONE_, value:" ", width:"5px"},									
										{type:_OUTPUT_, label:null, labelLocation:_NONE_, value:ZaMsg.Domain_AuthLDAPServerPort,  width:"40px"},	
										{type:_OUTPUT_, label:null, labelLocation:_NONE_, value:ZaMsg.Domain_AuthLDAPUseSSL, width:"40px"}									
									]
								},	
								{ref:ZaDomain.A_AuthLdapURL, type:_REPEAT_, label:ZaMsg.Domain_AuthLdapURL, repeatInstance:"", showAddButton:true, showRemoveButton:true,  
									addButtonLabel:ZaMsg.Domain_AddURL, 
									showAddOnNextRow:true,												
									removeButtonLabel:ZaMsg.Domain_REPEAT_REMOVE,
									items: [
										{ref:".", type:_LDAPURL_, label:null,ldapSSLPort:"636",ldapPort:"389", labelLocation:_NONE_}
									]
								},
								{ref:ZaDomain.A_zimbraAuthLdapStartTlsEnabled, type:_CHECKBOX_, label:ZaMsg.Domain_AuthLdapStartTlsEnabled, trueValue:"TRUE", falseValue:"FALSE"},
								{ref:ZaDomain.A_AuthLdapSearchFilter, type:_TEXTAREA_, width:"30em", height:100, label:ZaMsg.Domain_AuthLdapFilter, labelLocation:_LEFT_, textWrapping:"soft"},
								{ref:ZaDomain.A_AuthLdapSearchBase, type:_TEXTAREA_,width:"30em", height:50, label:ZaMsg.Domain_AuthLdapSearchBase, labelLocation:_LEFT_, textWrapping:"soft"},
								{type:_OUTPUT_, value:ZaMsg.NAD_DomainsAuthStr, colSpan:2}
							]
						}
					]
				},
				{type:_CASE_, numCols:2,colSizes:["220px","auto"],caseKey:ZaApplianceDomainXWizard.AUTH_CONFIG_STEP_2,
					visibilityChecks:[Case_XFormItem.prototype.isCurrentTab,[XForm.checkInstanceValue,ZaDomain.A_AuthMech,ZaDomain.AuthMech_ldap]],
					items: [
						{ref:ZaDomain.A_AuthUseBindPassword, type:_CHECKBOX_, label:ZaMsg.Domain_AuthUseBindPassword, labelLocation:_LEFT_,trueValue:"TRUE", falseValue:"FALSE",labelCssClass:"xform_label", align:_LEFT_},
						{ref:ZaDomain.A_AuthLdapSearchBindDn, type:_TEXTFIELD_, label:ZaMsg.Domain_AuthLdapBindDn, labelLocation:_LEFT_, 
							enableDisableChecks:[[XForm.checkInstanceValue,ZaDomain.A_AuthUseBindPassword,"TRUE"]],
							enableDisableChangeEventSources:[ZaDomain.A_AuthUseBindPassword]

						},
						{ref:ZaDomain.A_AuthLdapSearchBindPassword, type:_SECRET_, label:ZaMsg.Domain_AuthLdapBindPassword, labelLocation:_LEFT_, 
							enableDisableChecks:[[XForm.checkInstanceValue,ZaDomain.A_AuthUseBindPassword,"TRUE"]],
							enableDisableChangeEventSources:[ZaDomain.A_AuthUseBindPassword]

						},
						{ref:ZaDomain.A_AuthLdapSearchBindPasswordConfirm, type:_SECRET_, label:ZaMsg.Domain_AuthLdapBindPasswordConfirm, labelLocation:_LEFT_, 
							enableDisableChecks:[[XForm.checkInstanceValue,ZaDomain.A_AuthUseBindPassword,"TRUE"]],
							enableDisableChangeEventSources:[ZaDomain.A_AuthUseBindPassword]

						}							
					]						
				},
				{type:_CASE_,  caseKey:ZaApplianceDomainXWizard.AUTH_CONFIG_SUM_STEP,
					visibilityChecks:[Case_XFormItem.prototype.isCurrentTab,ZaApplianceDomainXWizard.isAuthMechNotZimbra],
					items: [
						{type:_DWT_ALERT_,content:ZaMsg.Domain_AuthTestingInProgress,
							ref:null,
							colSpan:"2",
							iconVisible: true,
							align:_CENTER_,				
							style: DwtAlert.INFORMATION,
							visibilityChecks:[[XForm.checkInstanceValue,ZaDomain.A2_isTestingAuth,1]],
							visibilityChangeEventSources:[ZaDomain.A2_isTestingGAL]
						},
						{type:_GROUP_,numCols:2,colSizes:["220px","430px"],
							visibilityChecks:[[XForm.checkInstanceValue,ZaDomain.A2_isTestingAuth,0]],
							visibilityChangeEventSources:[ZaDomain.A2_isTestingAuth],	
							items:[
							{type:_OUTPUT_, value:ZaMsg.Domain_Auth_ConfigSummary, align:_CENTER_, colSpan:"*"}, 
							{type:_SPACER_, height:10},
							{ref:ZaDomain.A_AuthMech, type:_OUTPUT_, label:ZaMsg.Domain_AuthMech, choices:this.AuthMechs, alignment:_LEFT_},
							{type:_GROUP_, useParentTable:true,
								visibilityChecks:[[XForm.checkInstanceValue,ZaDomain.A_AuthMech,ZaDomain.AuthMech_ad]],
								visibilityChangeEventSources:[ZaDomain.A_AuthMech],
	 
								items:[
									{ref:ZaDomain.A_AuthADDomainName, type:_OUTPUT_, label:ZaMsg.Domain_AuthADDomainName, labelLocation:_LEFT_},
									{ref:ZaDomain.A_AuthLdapURL, type:_REPEAT_, label:ZaMsg.Domain_AuthLdapURL, labelLocation:_LEFT_,showAddButton:false, showRemoveButton:false,
										items:[
											{type:_OUTPUT_, ref:".", label:null,labelLocation:_NONE_}
										]
									}											
								]
							},
							{type:_GROUP_, useParentTable:true,
								visibilityChecks:[[XForm.checkInstanceValue,ZaDomain.A_AuthMech,ZaDomain.AuthMech_ldap]],
								visibilityChangeEventSources:[ZaDomain.A_AuthMech],
	 
								items:[
									{ref:ZaDomain.A_AuthLdapURL, type:_REPEAT_, label:ZaMsg.Domain_AuthLdapURL, labelLocation:_LEFT_,showAddButton:false, showRemoveButton:false,
										items:[
											{type:_OUTPUT_, ref:".", label:null,labelLocation:_NONE_}
										]
									},					
									{ref:ZaDomain.A_zimbraAuthLdapStartTlsEnabled, type:_OUTPUT_, label:ZaMsg.Domain_AuthLdapStartTlsEnabled, labelLocation:_LEFT_,choices:ZaModel.BOOLEAN_CHOICES},						
									{ref:ZaDomain.A_AuthLdapSearchFilter, type:_OUTPUT_, label:ZaMsg.Domain_AuthLdapFilter, labelLocation:_LEFT_},
									{ref:ZaDomain.A_AuthLdapSearchBase, type:_OUTPUT_, label:ZaMsg.Domain_AuthLdapSearchBase, labelLocation:_LEFT_},
									{ref:ZaDomain.A_AuthUseBindPassword, type:_OUTPUT_, label:ZaMsg.Domain_AuthUseBindPassword, labelLocation:_LEFT_,choices:ZaModel.BOOLEAN_CHOICES},											
									{ref:ZaDomain.A_AuthLdapSearchBindDn, type:_TEXTFIELD_, label:ZaMsg.Domain_AuthLdapBindDn, labelLocation:_LEFT_, 
										visibilityChecks:[[XForm.checkInstanceValue,ZaDomain.A_AuthUseBindPassword,"TRUE"]],
										visibilityChangeEventSources:[ZaDomain.A_AuthUseBindPassword]									
									}											
								]
							},
							{type:_SPACER_, height:10},
							{type:_OUTPUT_,value:ZaMsg.Domain_AuthProvideLoginPwd, align:_CENTER_, colSpan:"*"},
							{type:_TEXTFIELD_, label:ZaMsg.LBL_Domain_AuthTestUserName, ref:ZaDomain.A_AuthTestUserName, alignment:_LEFT_},
							{type:_SECRET_, label:ZaMsg.LBL_Domain_AuthTestPassword, ref:ZaDomain.A_AuthTestPassword, alignment:_LEFT_},
							{type:_CELLSPACER_},
							{type:_DWT_BUTTON_, 
								onActivate:"ZaApplianceDomainXWizard.testAuthSettings.call(this)", 
								label:ZaMsg.Domain_GALTestSettings, 
								enableDisableChecks:[],
								visibilityChecks:[],					
								valign:_BOTTOM_,width:"100px"
							}
						]}
					]
				},

				{type:_CASE_, numCols:1, caseKey: ZaApplianceDomainXWizard.AUTH_TEST_RESULT_STEP,
					visibilityChecks:[Case_XFormItem.prototype.isCurrentTab,ZaApplianceDomainXWizard.isAuthMechNotZimbra],
					visibilityChangeEventSources:[ZaModel.currentStep],
					items: [
						{type:_GROUP_, 
							visibilityChecks:[[XForm.checkInstanceValue,ZaDomain.A_AuthTestResultCode,ZaDomain.Check_OK]],
							visibilityChangeEventSources:[ZaDomain.A_AuthTestResultCode],
							items: [
								{type:_OUTPUT_, value:ZaMsg.Domain_AuthTestSuccessful, alignment:_CENTER_}
							]
						},
				    	{type:_DWT_ALERT_,content:ZaMsg.Domain_AuthTestSkipped,
							ref:null,
							colSpan:"2",
							iconVisible: true,
							align:_CENTER_,				
							style: DwtAlert.WARNING,
							visibilityChecks:[[XForm.checkInstanceValue,ZaDomain.A_AuthTestResultCode,ZaDomain.Check_SKIPPED]],
							visibilityChangeEventSources:[ZaDomain.A_AuthTestResultCode]									
				    	},
						{type:_GROUP_, 
							visibilityChangeEventSources:[ZaDomain.A_AuthTestResultCode],
							visibilityChecks:[[XForm.checkInstanceValueNot,ZaDomain.A_AuthTestResultCode,ZaDomain.Check_OK],
							                  [XForm.checkInstanceValueNot,ZaDomain.A_AuthTestResultCode,ZaDomain.Check_SKIPPED]
							                 ],
							items: [
								{type:_OUTPUT_, value:ZaMsg.Domain_AuthTestFailed, alignment:_CENTER_, colSpan:2, label:null},
								{type:_OUTPUT_, ref:ZaDomain.A_AuthTestResultCode, label:ZaMsg.Domain_AuthTestResultCode, choices:this.TestResultChoices, alignment:_LEFT_},
								{type:_OUTPUT_, ref:ZaDomain.A_AuthComputedBindDn, label:ZaMsg.Domain_AuthComputedBindDn, alignment:_LEFT_, 
									visibilityChangeEventSources:[ZaDomain.A_AuthMech],
									visibilityChecks:[[XForm.checkInstanceValue,ZaDomain.A_AuthMech,ZaDomain.AuthMech_ad]]

								},
								{type:_TEXTAREA_, ref:ZaDomain.A_AuthTestMessage, label:ZaMsg.Domain_AuthTestMessage, height:150, alignment:_LEFT_, width:"320px"}
							]
						}
					
					]
				},
				{type:_CASE_, caseKey:ZaApplianceDomainXWizard.VHOST_STEP, 
					items:[
						{type:_DWT_ALERT_,content:null,ref:ZaDomain.A_domainName,
							getDisplayValue: function (itemVal) {
								return AjxMessageFormat.format(ZaMsg.Domain_VH_Explanation,itemVal);
							},
							colSpan:"*",
							iconVisible: false,
							align:_CENTER_,				
							style: DwtAlert.INFORMATION
						},
						{ref:ZaDomain.A_zimbraVirtualHostname, type:_REPEAT_, label:null, repeatInstance:"", showAddButton:true, showRemoveButton:true, 
								addButtonLabel:ZaMsg.NAD_AddVirtualHost, 
								showAddOnNextRow:true,
								removeButtonLabel:ZaMsg.NAD_RemoveVirtualHost,
								items: [
									{ref:".", type:_TEXTFIELD_, label:null,width:250}
								]
						}
					]
				},
				{type:_CASE_, caseKey:ZaApplianceDomainXWizard.NOTEBOOK_STEP, 
					items: [
						{ref:ZaDomain.A_CreateNotebook, type:_CHECKBOX_, label:ZaMsg.Domain_CreateNotebook, labelLocation:_LEFT_,trueValue:"TRUE", falseValue:"FALSE",labelCssClass:"xform_label", align:_LEFT_,
							onChange:function(value, event, form){
								this.setInstanceValue(value);
								if(!this.getInstanceValue(ZaDomain.A_zimbraNotebookAccount))
									this.setInstanceValue(ZaDomain.DEF_WIKI_ACC+"@"+this.getInstanceValue(ZaDomain.A_domainName), ZaDomain.A_zimbraNotebookAccount);
							}
						},
						{ref:ZaDomain.A_zimbraNotebookAccount, type:_TEXTFIELD_, label:ZaMsg.Domain_NotebookAccountName, labelLocation:_LEFT_, 
							enableDisableChecks:[[XForm.checkInstanceValue,ZaDomain.A_CreateNotebook,"TRUE"]],
							enableDisableChangeEventSources:[ZaDomain.A_CreateNotebook],bmolsnr:true							
						},						
						{ref:ZaDomain.A_NotebookAccountPassword, type:_SECRET_, label:ZaMsg.Domain_NotebookAccountPassword, labelLocation:_LEFT_, 
							enableDisableChecks:[[XForm.checkInstanceValue,ZaDomain.A_CreateNotebook,"TRUE"]],
							enableDisableChangeEventSources:[ZaDomain.A_CreateNotebook]
						},
						{ref:ZaDomain.A_NotebookAccountPassword2, type:_SECRET_, label:ZaMsg.NAD_ConfirmPassword, labelLocation:_LEFT_, 
							enableDisableChecks:[[XForm.checkInstanceValue,ZaDomain.A_CreateNotebook,"TRUE"]],
							enableDisableChangeEventSources:[ZaDomain.A_CreateNotebook]
						}												
					]
				},	
				{type:_CASE_, caseKey:ZaApplianceDomainXWizard.NOTEBOOK_ACL_STEP, 
					items: [
						{type:_ZAWIZ_TOP_GROUPER_,label:ZaMsg.Domain_GlobalAcl,colSizes:["200px","300px"],  width: "500px",
							items:[
								{ref:ZaDomain.A_NotebookDomainACLs, type:_ACL_, label:ZaMsg.LBL_ACL_Dom+":",labelLocation:_LEFT_,
									visibleBoxes:{r:true,w:true,a:false,i:true,d:true,x:false}
								},							
								{type:_SPACER_, height:10},
								{ref:ZaDomain.A_NotebookAllACLs, type:_ACL_, label:ZaMsg.LBL_ACL_All+":",labelLocation:_LEFT_,
									visibleBoxes:{r:true,w:true,a:false,i:true,d:true,x:false}
								},
								{type:_SPACER_, height:10},
								{ref:ZaDomain.A_NotebookPublicACLs, type:_ACL_, label:ZaMsg.LBL_ACL_Public+":",labelLocation:_LEFT_,
									visibleBoxes:{r:true,w:false,a:false,i:false,d:false,x:false}
								},
								{type:_SPACER_, height:10}

							]
						},
						{type:_SPACER_, height:10},
						{type:_ZAWIZ_TOP_GROUPER_, numCols:1, colSizes:["100%"], label:ZaMsg.Domain_PerGrp_Acl,width:"500px",
							items:[
								{type:_REPEAT_, ref:ZaDomain.A_NotebookGroupACLs,width:"100%",
									label:null, 
									repeatInstance:{name:"test@test.com",acl:{r:0,w:0,i:0,d:0,a:0,x:0}}, 
									showAddButton:true, showRemoveButton:true, 
									addButtonLabel:ZaMsg.Domain_AddGrpAcl, 
									addButtonWidth: 100,
									showAddOnNextRow:true,
									removeButtonLabel:ZaMsg.Domain_REPEAT_REMOVE,								
									removeButtonWidth:80,											
									items: [
										{ref:".", type:_ADDR_ACL_, label:null, labelLocation:_NONE_,
											visibleBoxes:{r:true,w:true,a:false,i:true,d:true,x:false},
											onChange:null,
											//forceUpdate:true,
											dataFetcherMethod:ZaSearch.prototype.dynSelectSearchGroups
										}
									]
								}
							]
						},
						{type:_SPACER_, height:10},
						{type:_ZAWIZ_TOP_GROUPER_, numCols:1,colSizes:["100%"],label:ZaMsg.Domain_PerUsr_Acl, width: "500px",
							items:[
								{type:_REPEAT_, ref:ZaDomain.A_NotebookUserACLs,width:"100%",
									label:null, 
									repeatInstance:{name:"test@test.com",acl:{r:0,w:0,i:0,d:0,a:0,x:0}}, 
									showAddButton:true, showRemoveButton:true, 
									addButtonLabel:ZaMsg.Domain_AddUsrAcl, 
									addButtonWidth: 150,
									showAddOnNextRow:true,
									removeButtonLabel:ZaMsg.Domain_REPEAT_REMOVE,
									removeButtonWidth:80,								
									items: [
										{ref:".", type:_ADDR_ACL_, label:null, labelLocation:_NONE_,
											visibleBoxes:{r:true,w:true,a:false,i:true,d:true,x:false},
											onChange:null,
											forceUpdate:true,
											dataFetcherMethod:ZaSearch.prototype.dynSelectSearch,
											dataFetcherTypes:[ZaSearch.ACCOUNTS],
											dataFetcherAttrs:[ZaItem.A_zimbraId, ZaItem.A_cn, ZaAccount.A_name, ZaAccount.A_displayname, ZaAccount.A_mail]
										}
									]
								}

							]
						}					
					]
				},							
				{type:_CASE_, caseKey:ZaApplianceDomainXWizard.CONFIG_COMPLETE_STEP,
					items: [
						{type:_OUTPUT_, value:ZaMsg.Domain_Config_Complete}
					]
				}										
			]	
		}
	];
}
ZaXDialog.XFormModifiers["ZaApplianceDomainXWizard"].push(ZaApplianceDomainXWizard.myXFormModifier);
