/*
 * ***** BEGIN LICENSE BLOCK *****
 * Zimbra Collaboration Suite Server
 * Copyright (C) 2012, 2013, 2014, 2016 Synacor, Inc.
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

import com.zimbra.common.localconfig.KnownKey;

/**
 * <code>ClientUploaderLC</code> holds the user configurations for Client Upload extension.
 *
 * @author Dongwei Feng
 * @since 2012.3.15
 */
public final class ClientUploaderLC {
    /**
     * A directory for client repository, default: /opt/zimbra/jetty/webapps/zimbra/downloads
     */
    public static final KnownKey client_repository_location = new KnownKey("client_repository_location", "/opt/zimbra/jetty/webapps/zimbra/downloads");

    /**
     * Max size of the uploaded file, default: 2G
     */
    public static final KnownKey client_software_max_size = new KnownKey("client_software_max_size").setDefault(2 * 1024 * 1024 * 1024);
}
