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

import com.zimbra.common.service.ServiceException;
import com.zimbra.cs.extension.ExtensionDispatcherServlet;
import com.zimbra.cs.extension.ZimbraExtension;

public class ZClientUploaderExt implements ZimbraExtension {
    public static final String EXTENTION_NAME = "clientUploader";
    public void init() {
        /*
         * content handler
         */
        try {
            ExtensionDispatcherServlet.register(this, new ClientUploadHandler());
        } catch (ServiceException e) {
            Log.clientUploader.fatal("caught exception while registering ClientUploadHandler");
        }
    }

    public void destroy() {
        ExtensionDispatcherServlet.unregister(this);
    }

    public String getName() {
        return EXTENTION_NAME;
    }
}
