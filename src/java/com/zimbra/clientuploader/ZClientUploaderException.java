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

/**
 * <code>ZClientUploaderException</code> will be thrown if error occurs in this extension.
 *
 * @author Dongwei Feng
 * @since 2012.3.14
 */
public class ZClientUploaderException extends Exception {
    private ZClientUploaderRespCode code;

    public ZClientUploaderException(ZClientUploaderRespCode code) {
        super();
        this.code = code;
    }

    public ZClientUploaderException(ZClientUploaderRespCode code, Throwable t) {
        super(t);
        this.code = code;
    }

    public ZClientUploaderException(ZClientUploaderRespCode code, String msg) {
        super(msg);
        this.code = code;
    }

    public ZClientUploaderException(ZClientUploaderRespCode code, String msg, Throwable t) {
        super(msg, t);
        this.code = code;
    }

    public ZClientUploaderRespCode getRespCode() {
        return code;
    }
    
    @Override
    public String toString() {
        return code + ", " + super.toString();
    }
}
