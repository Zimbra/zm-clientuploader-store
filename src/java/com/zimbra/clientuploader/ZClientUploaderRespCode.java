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
 * Response code for client software uploade extension
 *
 * @author Dongwei Feng
 * @since 2012.3.16
 */
public enum ZClientUploaderRespCode {
    SUCCEEDED (1, "Succeeded"),
    FAILED (20000000, "Upload failed"),
    NOT_A_FILE (20000001, "The request does not upload a file"),
    REPO_INVALID (20000002, "Invalid directory for client repo or temporary files."),
    REPO_NO_WRITE (20000003, "No write permission on directory for client repo or temporary files"),
    SAVE_ERROR (20000004, "Failed to save the upload file"),
    PARSE_REQUEST_ERROR (20000005, "Failed to parse the request"),
    FILE_EXCEED_LIMIT (20000006, "File size exceeds allowed max size"),

    MISSING_LIB_PATH (30000001, "Cannot find lib directory so cannot execute zmupdatedownload"),
    UPDATE_LINK_FAILED (30000002, "Failed to update links in downloads/index.html"),

    NO_PERMISSION(40000001, "Permission denied");

    private long code;
    private String description;
    ZClientUploaderRespCode(long code, String description) {
        this.code = code;
        this.description = description;
    }

    public long getCode() {
        return code;
    }
    
    public String getDescription() {
        return description;
    }

    @Override
    public String toString() {
        return new StringBuilder().append("Error Code: ")
                .append(code)
                .append(", Description: ")
                .append(description)
                .toString();
    }
}
