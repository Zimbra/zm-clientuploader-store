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

import java.io.File;
import java.util.Iterator;
import java.util.List;

import org.apache.commons.fileupload.FileItem;
import org.apache.commons.fileupload.FileUploadBase;
import org.apache.commons.fileupload.FileUploadException;

/**
 * <code>ZClientUploader</code> saves the uploaded files according to configurations.
 *
 * @author Dongwei Feng
 * @since 2012.3.14
 */
public class ZClientUploader {
    //Repository directory
    private static String CLIENT_UPLOAD_REPO_DIR;
    static {
        CLIENT_UPLOAD_REPO_DIR = ClientUploaderLC.client_repository_location.value();
        if (!CLIENT_UPLOAD_REPO_DIR.endsWith(File.separator)) {
            CLIENT_UPLOAD_REPO_DIR += File.separator;
        }
    }

    /**
     * Save the uploaded file from request
     * @param req
     * @throws ZClientUploaderException if fails to save
     */
    public void upload(List<FileItem> items) throws ZClientUploaderException {
        if (items == null || items.size() <= 0) {
            throw new ZClientUploaderException(ZClientUploaderRespCode.NOT_A_FILE);
        }
        File parent = getClientRepo();
        try {
            Iterator<FileItem> iter = items.iterator();
            int count = 0;
            while (iter.hasNext()) {
                FileItem item = iter.next();
                if (!item.isFormField()) {
                    String fileName = item.getName();
                    if (fileName != null && !fileName.isEmpty()) {
                        item.write(new File(parent, fileName));
                        count ++;
                    }
                }
            }

            if (count == 0) {
                throw new ZClientUploaderException(ZClientUploaderRespCode.NOT_A_FILE);
            }
        } catch (ZClientUploaderException e) {
            throw e;
        } catch (FileUploadBase.SizeLimitExceededException e) {
            throw new ZClientUploaderException(ZClientUploaderRespCode.FILE_EXCEED_LIMIT, e);
        } catch (FileUploadException e) {
            throw new ZClientUploaderException(ZClientUploaderRespCode.PARSE_REQUEST_ERROR, e);
        } catch (Exception e) {
            throw new ZClientUploaderException(ZClientUploaderRespCode.SAVE_ERROR, e);
        }
    }

    /*
     * Get the directory for repository
     * @return
     * @throws ZClientUploaderException if the directory does not exist, cannot be created,
     *  or no write permission on it.
     */
    private static File getClientRepo() throws ZClientUploaderException {
        return getDirectory(CLIENT_UPLOAD_REPO_DIR);
    }


    private static File getDirectory(String name) throws ZClientUploaderException{
        File file;
        try {
            file = new File(name);
            if (!file.exists()) {
                file.mkdirs();
            }
            if (!file.isDirectory()) {
                throw new ZClientUploaderException(ZClientUploaderRespCode.REPO_INVALID,"Not a directory");
            }
            if (!file.canWrite()) {
                throw new ZClientUploaderException(ZClientUploaderRespCode.REPO_NO_WRITE,"No write permission on repository directory");
            }
        } catch (ZClientUploaderException e) {
            throw e;
        } catch (Exception e) {
            throw new ZClientUploaderException(ZClientUploaderRespCode.REPO_INVALID,
                    "Failed to create directory for client repository", e);
        }


        return file;
    }

}
