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

import java.io.BufferedReader;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.Reader;
import java.io.StringWriter;
import java.io.Writer;
import java.util.List;

import org.apache.commons.fileupload.FileItem;

/**
 * Response code for client software upload extension
 *
 * @author Dongwei Feng
 * @since 2012.3.18
 */
public class ZClientUploadManager {
    private static final String LIB_PATH = "java.library.path";
    private static final String COMMAND_PATH = "libexec/zmupdatedownload";

    /**
     * Contains 2 steps:
     *    1. Save the uploaded file;
     *    2. Call the script to update download index page.
     * @param req
     * @throws ZClientUploaderException
     */
    public void uploadClient(List<FileItem> items) throws ZClientUploaderException {
        ZClientUploader uploader = new ZClientUploader();
        uploader.upload(items);
        this.updateLinks();
    }

    private void updateLinks() throws ZClientUploaderException {
        String libPath = System.getProperty(LIB_PATH);
        if (libPath == null) {
            throw new ZClientUploaderException(ZClientUploaderRespCode.MISSING_LIB_PATH);
        }

        String command = libPath.substring(0, libPath.lastIndexOf(File.separator) + 1) + COMMAND_PATH;
        ProcessBuilder pb = new ProcessBuilder(command);
        pb.redirectErrorStream(true);
        try {
            Process p = pb.start();
            int exitStatus = p.waitFor();
            if (exitStatus != 0) {
                throw new ZClientUploaderException(ZClientUploaderRespCode.UPDATE_LINK_FAILED);
            }
            logOutput(p);
        } catch (ZClientUploaderException e) {
            throw e;
        } catch (Exception e) {
            throw new ZClientUploaderException(ZClientUploaderRespCode.UPDATE_LINK_FAILED);
        }
    }

    private void logOutput(Process p) throws IOException {
        InputStream is = p.getInputStream();
        if (is != null) {
            Writer writer = new StringWriter();
            char[] buffer = new char[1024];
            try {
                Reader reader = new BufferedReader(new InputStreamReader(is,"UTF-8"));
                int n;
                while ((n = reader.read(buffer)) != -1) {
                    writer.write(buffer, 0, n);
                }
            } catch (IOException e) {
                Log.clientUploader.error("Failed to log the output", e);
            } finally {
                is.close();
            }
            Log.clientUploader.debug(writer.toString());
        }
    }
}
