#!/bin/bash
echo "*** Configuring zimbra-extension-clientuploader ***"

echo "*** Deploying zimbra-extension-clientuploader ***"
if [  ! -d /opt/zimbra/lib/ext/com_zimbra_clientuploader ]; then
    mkdir -p /opt/zimbra/lib/ext/com_zimbra_clientuploader
fi
mv /opt/zimbra/lib/clientuploader/com_zimbra_clientuploader.jar /opt/zimbra/lib/ext/com_zimbra_clientuploader/com_zimbra_clientuploader.jar
rm -rf /opt/zimbra/lib/clientuploader

echo "*** zimbra-extension-clientuploader Installation Completed. ***"
echo "*** Restart the mailbox service as zimbra user. Run ***"
echo "*** su - zimbra ***"
echo "*** zmmailboxdctl restart ***"