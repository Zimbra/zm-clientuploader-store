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
* @class ZaApplianceGALConfigXWizard
* @contructor
* @param parent
* @param app
* @author Greg Solovyev
**/
ZaApplianceGALConfigXWizard = function(parent, entry) {
	ZaXWizardDialog.call(this, parent, null, ZaMsg.NCD_GALConfigTitle, "700px", "350px","ZaApplianceGALConfigXWizard");

	this.TAB_INDEX = 0;
	
	ZaApplianceGALConfigXWizard.GALMODE_STEP = ++this.TAB_INDEX;
	ZaApplianceGALConfigXWizard.GAL_CONFIG_STEP_2 = ++this.TAB_INDEX;
	ZaApplianceGALConfigXWizard.GAL_CONFIG_SUM_STEP = ++this.TAB_INDEX;
	ZaApplianceGALConfigXWizard.GAL_TEST_RESULT_STEP = ++this.TAB_INDEX;
	ZaApplianceGALConfigXWizard.CONFIG_COMPLETE_STEP = ++this.TAB_INDEX;
	
	this.stepChoices = [
		{label:ZaMsg.GALMode, value:ZaApplianceGALConfigXWizard.GALMODE_STEP},
		{label:ZaMsg.GALConfiguration, value:ZaApplianceGALConfigXWizard.GAL_CONFIG_STEP_2},		
		{label:ZaMsg.GALConfigSummary, value:ZaApplianceGALConfigXWizard.GAL_CONFIG_SUM_STEP},		
		{label:ZaMsg.GalTestResult, value:ZaApplianceGALConfigXWizard.GAL_TEST_RESULT_STEP},
		{label:ZaMsg.DomainConfigComplete, value:ZaApplianceGALConfigXWizard.CONFIG_COMPLETE_STEP}	
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

		
	this.initForm(ZaDomain.myXModel,this.getMyXForm(entry), null);		
	this._localXForm.addListener(DwtEvent.XFORMS_FORM_DIRTY_CHANGE, new AjxListener(this, ZaApplianceGALConfigXWizard.prototype.handleXFormChange));
	this._localXForm.addListener(DwtEvent.XFORMS_VALUE_ERROR, new AjxListener(this, ZaApplianceGALConfigXWizard.prototype.handleXFormChange));	
	this.lastErrorStep=0;
	this._helpURL = location.pathname + ZaUtil.HELP_URL + "managing_domains/using_the_global_address_list_(gal).htm?locid="+AjxEnv.DEFAULT_LOCALE
	
}

ZaApplianceGALConfigXWizard.prototype = new ZaXWizardDialog;
ZaApplianceGALConfigXWizard.prototype.constructor = ZaApplianceGALConfigXWizard;
ZaXDialog.XFormModifiers["ZaApplianceGALConfigXWizard"] = new Array();




ZaApplianceGALConfigXWizard.prototype.handleXFormChange = 
function () {
	if(this._localXForm.hasErrors()) {
		if(this.lastErrorStep < this._containedObject[ZaModel.currentStep])
			this.lastErrorStep=this._containedObject[ZaModel.currentStep];
	} else {
		this.lastErrorStep=0;
	}
	this.changeButtonStateForStep(this._containedObject[ZaModel.currentStep]);	
}

ZaApplianceGALConfigXWizard.prototype.changeButtonStateForStep = 
function(stepNum) {
	if(this.lastErrorStep == stepNum) {
		this._button[DwtWizardDialog.FINISH_BUTTON].setEnabled(false);
		this._button[DwtWizardDialog.NEXT_BUTTON].setEnabled(false);
		if(stepNum>1)
			this._button[DwtWizardDialog.PREV_BUTTON].setEnabled(true);
	} else {
		if (stepNum == ZaApplianceGALConfigXWizard.GALMODE_STEP) {
			this._button[DwtWizardDialog.PREV_BUTTON].setEnabled(false);
			this._button[DwtWizardDialog.FINISH_BUTTON].setEnabled(false);
			this._button[DwtWizardDialog.NEXT_BUTTON].setEnabled(true);
		} else if(stepNum == ZaApplianceGALConfigXWizard.GAL_CONFIG_SUM_STEP) {
			this._button[DwtWizardDialog.PREV_BUTTON].setEnabled(true);
			this._button[DwtWizardDialog.FINISH_BUTTON].setEnabled(false);
			this._button[DwtWizardDialog.NEXT_BUTTON].setEnabled(true);
		} else if(stepNum == ZaApplianceGALConfigXWizard.GAL_TEST_STEP) {
			this._button[DwtWizardDialog.NEXT_BUTTON].setEnabled(false);
			this._button[DwtWizardDialog.PREV_BUTTON].setEnabled(false);
			this._button[DwtWizardDialog.FINISH_BUTTON].setEnabled(false);
		} else if (stepNum == ZaApplianceGALConfigXWizard.GAL_TEST_RESULT_STEP) {
			this._button[DwtWizardDialog.NEXT_BUTTON].setEnabled(true);
			this._button[DwtWizardDialog.PREV_BUTTON].setEnabled(true);
			this._button[DwtWizardDialog.FINISH_BUTTON].setEnabled(true);
		} else if(stepNum == ZaApplianceGALConfigXWizard.CONFIG_COMPLETE_STEP) {
			this._button[DwtWizardDialog.PREV_BUTTON].setEnabled(true);
			this._button[DwtWizardDialog.NEXT_BUTTON].setEnabled(false);
			this._button[DwtWizardDialog.FINISH_BUTTON].setEnabled(true);
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
ZaApplianceGALConfigXWizard.prototype.setObject =
function(entry) {
	this._containedObject = new ZaDomain();
	ZaItem.prototype.copyTo.call(entry,this._containedObject,true,4);
	this._containedObject[ZaDomain.A2_isTestingGAL] = 0;
	this._containedObject[ZaDomain.A2_isTestingSync] = 0;

	/**
	 * Set silent defaults for appliance
	 */
	this._containedObject[ZaDomain.A2_create_gal_acc] = "TRUE";
	this._containedObject[ZaDomain.A2_new_gal_sync_account_name]=entry[ZaDomain.A2_new_gal_sync_account_name];
	this._containedObject[ZaDomain.A2_new_internal_gal_ds_name]=entry[ZaDomain.A2_new_internal_gal_ds_name];
	this._containedObject[ZaDomain.A2_new_external_gal_ds_name]=entry[ZaDomain.A2_new_external_gal_ds_name];

	
	
	this.setTitle(ZaMsg.NCD_GALConfigTitle + " (" + entry.name + ")");
	this._containedObject[ZaModel.currentStep] = 1;
	this._localXForm.setInstance(this._containedObject);	
}


/**
* static change handlers for the form
**/
ZaApplianceGALConfigXWizard.onGALServerTypeChange =
function (value, event, form) {
	if(value == "ad") {
		this.setInstanceValue("ad",ZaDomain.A_GalLdapFilter);
		this.setInstanceValue("adAutoComplete",ZaDomain.A_zimbraGalAutoCompleteLdapFilter);
	} else {
		if(AjxUtil.isEmpty(form.getModel().getInstanceValue(form.getInstance(),ZaDomain.A_zimbraGalAutoCompleteLdapFilter))) {
			this.setInstanceValue("(|(cn=%s*)(sn=%s*)(gn=%s*)(mail=%s*))",ZaDomain.A_zimbraGalAutoCompleteLdapFilter);
		}
	}
	this.setInstanceValue(value);	
}

ZaApplianceGALConfigXWizard.onGalModeChange = 
function (value, event, form) {
	this.setInstanceValue(value);
	if(value != "zimbra") {
		if(AjxUtil.isEmpty(form.getInstance().attrs[ZaDomain.A_GALServerType])) {
			this.setInstanceValue("ldap",ZaDomain.A_GALServerType);
		}
		if(AjxUtil.isEmpty(form.getInstance().attrs[ZaDomain.A_GalLdapSearchBase])) {
			if(form.getInstance().attrs[ZaDomain.A_domainName]) {
				var parts = form.getInstance().attrs[ZaDomain.A_domainName].split(".");
				var szSearchBase = "";
				var coma = "";
				for(var ix in parts) {
					szSearchBase += coma;
				 	szSearchBase += "dc=";
				 	szSearchBase += parts[ix];
					var coma = ",";
				}
				this.setInstanceValue(szSearchBase,ZaDomain.A_GalLdapSearchBase);
			}
		}
		if(AjxUtil.isEmpty(form.getInstance()[ZaDomain.A2_new_external_gal_polling_interval])) {
			this.setInstanceValue("2d",ZaDomain.A2_new_external_gal_polling_interval);
		}
		if(AjxUtil.isEmpty(form.getModel().getInstanceValue(form.getInstance(),ZaDomain.A_GalLdapFilter))) {
			this.setInstanceValue("(&(objectClass=organizationalPerson)(mail=*))",ZaDomain.A_GalLdapFilter);	
		}	
		if(AjxUtil.isEmpty(form.getModel().getInstanceValue(form.getInstance(),ZaDomain.A_zimbraGalAutoCompleteLdapFilter))) {
			this.setInstanceValue("(|(cn=%s*)(sn=%s*)(gn=%s*)(mail=%s*))",ZaDomain.A_zimbraGalAutoCompleteLdapFilter);
		}		
	} else {
		if(AjxUtil.isEmpty(form.getInstance()[ZaDomain.A2_new_internal_gal_polling_interval])) {
			this.setInstanceValue("2d",ZaDomain.A2_new_internal_gal_polling_interval);
		}
	}
}

ZaApplianceGALConfigXWizard.testGALSettings =
function () {
	var instance = this.getInstance();
	this.getModel().setInstanceValue(instance,ZaDomain.A2_isTestingGAL,1);
	var callback = new AjxCallback(this, ZaApplianceGALConfigXWizard.checkGALConfigCallBack);
	ZaDomain.testGALSettings(instance, callback, instance[ZaDomain.A_GALSampleQuery]);		
}
/**
* Callback function invoked by Asynchronous CSFE command when "check" call returns
**/
ZaApplianceGALConfigXWizard.checkGALConfigCallBack = 
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

	this.getForm().parent.goPage(ZaApplianceGALConfigXWizard.GAL_TEST_RESULT_STEP);
}

/**
* Overwritten methods that control wizard's flow (open, go next,go previous, finish)
**/
ZaApplianceGALConfigXWizard.prototype.popup = 
function (loc) {
	ZaXWizardDialog.prototype.popup.call(this, loc);
	this._button[DwtWizardDialog.NEXT_BUTTON].setText(AjxMsg._next);
	this._button[DwtWizardDialog.NEXT_BUTTON].setEnabled(true);
	this._button[DwtWizardDialog.FINISH_BUTTON].setEnabled(false);
	this._button[DwtWizardDialog.PREV_BUTTON].setEnabled(false);	
}

ZaApplianceGALConfigXWizard.prototype.goPage =
function(pageNum) {
	ZaXWizardDialog.prototype.goPage.call(this, pageNum);
	this.changeButtonStateForStep(pageNum);
}

ZaApplianceGALConfigXWizard.prototype.goPrev =
function () {
	if(this._containedObject[ZaModel.currentStep] == ZaApplianceGALConfigXWizard.GAL_TEST_RESULT_STEP) {
		this.goPage(ZaApplianceGALConfigXWizard.GAL_CONFIG_SUM_STEP);
	}  else if (this._containedObject[ZaModel.currentStep] == ZaApplianceGALConfigXWizard.CONFIG_COMPLETE_STEP) {
		if(this._containedObject.attrs[ZaDomain.A_zimbraGalMode]==ZaDomain.GAL_Mode_internal) {
			this.goPage(ZaApplianceGALConfigXWizard.GALMODE_STEP);
		} else {
			this.goPage(ZaApplianceGALConfigXWizard.GAL_TEST_RESULT_STEP);
		}
	} else {
		this._button[DwtWizardDialog.NEXT_BUTTON].setEnabled(true);
		this.goPage(this._containedObject[ZaModel.currentStep]-1);
	}
}

ZaApplianceGALConfigXWizard.prototype.goNext = 
function() {
	if(this._containedObject[ZaModel.currentStep] == ZaApplianceGALConfigXWizard.GALMODE_STEP && this._containedObject.attrs[ZaDomain.A_zimbraGalMode]==ZaDomain.GAL_Mode_internal) {
		this.goPage(ZaApplianceGALConfigXWizard.CONFIG_COMPLETE_STEP);
	} else if (this._containedObject[ZaModel.currentStep] == ZaApplianceGALConfigXWizard.GAL_TEST_RESULT_STEP) {
		this.goPage(ZaApplianceGALConfigXWizard.CONFIG_COMPLETE_STEP);
	} else if(this._containedObject[ZaModel.currentStep] == ZaApplianceGALConfigXWizard.GALMODE_STEP && this._containedObject.attrs[ZaDomain.A_zimbraGalMode]!=ZaDomain.GAL_Mode_internal) {	
		//check that Filter is provided and at least one server
		if(!this._containedObject.attrs[ZaDomain.A_GalLdapFilter]) {
			ZaApp.getInstance().getCurrentController().popupErrorDialog(ZaMsg.ERROR_SEARCH_FILTER_REQUIRED);			
			return;
		}
		if(!this._containedObject.attrs[ZaDomain.A_GalLdapURL] || this._containedObject.attrs[ZaDomain.A_GalLdapURL].length < 1) {
			ZaApp.getInstance().getCurrentController().popupErrorDialog(ZaMsg.ERROR_LDAP_URL_REQUIRED);					
			return;
		}
		this.goPage(ZaApplianceGALConfigXWizard.GAL_CONFIG_STEP_2);
	} else if(this._containedObject[ZaModel.currentStep] == ZaApplianceGALConfigXWizard.GAL_CONFIG_STEP_2) {
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
		this.goPage(ZaApplianceGALConfigXWizard.GAL_CONFIG_SUM_STEP);
	} else if(this._containedObject[ZaModel.currentStep] == ZaApplianceGALConfigXWizard.GAL_CONFIG_SUM_STEP) {
		this._localXForm.setInstanceValue(ZaDomain.Check_SKIPPED,ZaDomain.A_GALSearchTestResultCode);
		this.goPage(ZaApplianceGALConfigXWizard.GAL_TEST_RESULT_STEP);
	} else {
		this.goPage(this._containedObject[ZaModel.currentStep] + 1);
	}
}

ZaApplianceGALConfigXWizard.myXFormModifier = function(xFormObject, entry) {
	var resultHeaderList = new Array();
	resultHeaderList[0] = new ZaListHeaderItem("email", ZaMsg.ALV_Name_col, null, "116px", null, "email", true, true);
	resultHeaderList[1] = new ZaListHeaderItem("fullName", ZaMsg.ALV_FullName_col, null, "auto", null, "fullName", true, true);
	
	xFormObject.items = [
		{type:_OUTPUT_, colSpan:2, align:_CENTER_, valign:_TOP_, ref:ZaModel.currentStep, choices:this.stepChoices,valueChangeEventSources:[ZaModel.currentStep]},
		{type:_SEPARATOR_, align:_CENTER_, valign:_TOP_},
		{type:_SPACER_,  align:_CENTER_, valign:_TOP_},				
		{type: _SWITCH_,width:650,
			items: [
				{type:_CASE_, caseKey:ZaApplianceGALConfigXWizard.GALMODE_STEP,numCols:2,colSizes:["220px","430px"],
					items: [
						{ref:ZaDomain.A_zimbraGalMode, type:_OSELECT1_, label:ZaMsg.Domain_GalMode, labelLocation:_LEFT_, choices:this.GALModes, onChange:ZaApplianceGALConfigXWizard.onGalModeChange},
						{type:_GROUP_, colSpan:2,numCols:2,colSizes:["220px","430px"],
							visibilityChangeEventSources:[ZaDomain.A_zimbraGalMode],
							visibilityChecks:[ZaNewDomainXWizard.isDomainModeNotInternal],
							cssStyle:"overflow:auto",
							items: [
								{ref:ZaDomain.A_GALServerType, visibilityChecks:[],enableDisableChecks:[],
									type:_OSELECT1_, label:ZaMsg.Domain_GALServerType, labelLocation:_LEFT_, 
									choices:this.GALServerTypes, onChange:ZaApplianceGALConfigXWizard.onGALServerTypeChange
								},
								{type:_GROUP_, numCols:6, colSpan:6,label:"   ",labelLocation:_LEFT_,
									visibilityChecks:[[ZaItem.hasWritePermission,ZaDomain.A_GalLdapURL]],
									items: [
										{type:_OUTPUT_, label:null, labelLocation:_NONE_, value:" ", width:"35px"},
										{type:_OUTPUT_, label:null, labelLocation:_NONE_, value:ZaMsg.Domain_GALServerName, width:"200px"},
										{type:_OUTPUT_, label:null, labelLocation:_NONE_, value:" ", width:"5px"},									
										{type:_OUTPUT_, label:null, labelLocation:_NONE_, value:ZaMsg.Domain_GALServerPort,  width:"40px"},	
										{type:_OUTPUT_, label:null, labelLocation:_NONE_, value:ZaMsg.Domain_GALUseSSL, width:"40px"}									
									]
								},
								{ref:ZaDomain.A_GalLdapURL, type:_REPEAT_, label:ZaMsg.Domain_GalLdapURL, repeatInstance:"", showAddButton:true, showRemoveButton:true,  
									visibilityChecks:[[ZaItem.hasWritePermission,ZaDomain.A_GalLdapURL]],
									addButtonLabel:ZaMsg.Domain_AddURL, 
									removeButtonLabel:ZaMsg.Domain_REPEAT_REMOVE,
									showAddOnNextRow:true,
									items: [
										{ref:".", type:_LDAPURL_, label:null,ldapSSLPort:"3269",ldapPort:"3268",  labelLocation:_NONE_,
										visibilityChecks:[],enableDisableChecks:[]}
									]
								},
								{ref:ZaDomain.A_GalLdapFilter, type:_TEXTAREA_, width:380, height:40, label:ZaMsg.Domain_GalLdapFilter, labelLocation:_LEFT_, 
									enableDisableChecks:[[XForm.checkInstanceValue,ZaDomain.A_GALServerType,ZaDomain.GAL_ServerType_ldap]],bmolsnr:true,
									enableDisableChangeEventSources:[ZaDomain.A_GALServerType]
									
								},
								{ref:ZaDomain.A_zimbraGalAutoCompleteLdapFilter, type:_TEXTAREA_, width:380, height:40, label:ZaMsg.Domain_zimbraGalAutoCompleteLdapFilter, labelLocation:_LEFT_, 
									enableDisableChecks:[[XForm.checkInstanceValue,ZaDomain.A_GALServerType,ZaDomain.GAL_ServerType_ldap]],
									enableDisableChangeEventSources:[ZaDomain.A_GALServerType],bmolsnr:true
								},						
								{ref:ZaDomain.A_GalLdapSearchBase, type:_TEXTAREA_, width:380, height:40, label:ZaMsg.Domain_GalLdapSearchBase, labelLocation:_LEFT_,bmolsnr:true}
							]
						}
					]
				},
				{type:_CASE_, numCols:2,colSizes:["220px","430px"],
					caseKey:ZaApplianceGALConfigXWizard.GAL_CONFIG_STEP_2,
					visibilityChangeEventSources:[ZaModel.currentStep],
					visibilityChecks:[Case_XFormItem.prototype.isCurrentTab,ZaNewDomainXWizard.isDomainModeNotInternal],					
					items: [
						{ref:ZaDomain.A_UseBindPassword, type:_CHECKBOX_, label:ZaMsg.Domain_UseBindPassword, labelLocation:_LEFT_,trueValue:"TRUE", falseValue:"FALSE",labelCssClass:"xform_label", align:_LEFT_,
							enableDisableChecks:[],visibilityChecks:[]
						},
						{ref:ZaDomain.A_GalLdapBindDn, type:_INPUT_, label:ZaMsg.Domain_GalLdapBindDn, labelLocation:_LEFT_, 
							enableDisableChecks:[[XForm.checkInstanceValue,ZaDomain.A_UseBindPassword,"TRUE"]],
							enableDisableChangeEventSources:[ZaDomain.A_UseBindPassword]							
						},
						{ref:ZaDomain.A_GalLdapBindPassword, type:_SECRET_, label:ZaMsg.Domain_GalLdapBindPassword, labelLocation:_LEFT_, 
							enableDisableChecks:[[XForm.checkInstanceValue,ZaDomain.A_UseBindPassword,"TRUE"]],
							enableDisableChangeEventSources:[ZaDomain.A_UseBindPassword]							
						},
						{ref:ZaDomain.A_GalLdapBindPasswordConfirm, type:_SECRET_, label:ZaMsg.Domain_GalLdapBindPasswordConfirm, labelLocation:_LEFT_, 
							enableDisableChecks:[[XForm.checkInstanceValue,ZaDomain.A_UseBindPassword,"TRUE"]],
							enableDisableChangeEventSources:[ZaDomain.A_UseBindPassword],visibilityChecks:[]							
						}							
					]			
				},				
				{type:_CASE_, caseKey:ZaApplianceGALConfigXWizard.GAL_CONFIG_SUM_STEP,numCols:2,colSizes:["220px","430px"],
					items: [
						//search
						{type:_GROUP_,
							visibilityChecks:[ZaNewDomainXWizard.isDomainModeNotInternal,[XForm.checkInstanceValue,ZaDomain.A2_isTestingGAL,0]],
							visibilityChangeEventSources:[ZaDomain.A_zimbraGalMode,ZaDomain.A2_isTestingGAL],
							useParentTable:false,
							numCols:2,colSpan:2,
							items: [
								{ref:ZaDomain.A_zimbraGalMode, type:_OUTPUT_, label:ZaMsg.Domain_GalMode, choices:this.GALModes,
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
								{ref:ZaDomain.A_GALSampleQuery, type:_TEXTFIELD_, label:ZaMsg.Domain_GALSampleSearchName, labelLocation:_LEFT_, labelWrap:true, cssStyle:"width:100px;", bmolsnr:true,
									visibilityChecks:[],enableDisableChecks:[]
								},								
								{type:_CELLSPACER_},
								{type:_DWT_BUTTON_, 
									enableDisableChecks:[[XForm.checkInstanceValueNot,ZaDomain.A_GALSampleQuery," "],
									                     [XForm.checkInstanceValueNotEmty,ZaDomain.A_GALSampleQuery]],
									enableDisableChangeEventSources:[ZaDomain.A_GALSampleQuery],
									onActivate:"ZaApplianceGALConfigXWizard.testGALSettings.call(this)", 
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
				{type:_CASE_, caseKey:ZaApplianceGALConfigXWizard.GAL_TEST_RESULT_STEP,numCols:2,colSizes:["220px","430px"],
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
								{type:_TEXTAREA_, ref:ZaDomain.A_GALSearchTestMessage, label:ZaMsg.Domain_GALTestMessage, height:"200px", width:"380px",enableDisableChecks:[]}
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
				{type:_CASE_, caseKey:ZaApplianceGALConfigXWizard.CONFIG_COMPLETE_STEP,
					items: [
						{type:_OUTPUT_, value:ZaMsg.Domain_GalConfig_Complete}
					]
				}
			]	
		}	
	];
}

ZaXDialog.XFormModifiers["ZaApplianceGALConfigXWizard"].push(ZaApplianceGALConfigXWizard.myXFormModifier);
