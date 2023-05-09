########################################################################################################

SHELL=bash
NAME = zimbra-extension-clientuploader
DESC = Extension for administrators to upload client software to server
VERSION = 1.0.0

.PHONY: clean all

########################################################################################################

all: zimbra-extension-pkg

########################################################################################################

create-extension:
	ant clean jar

stage-extension-jar:
	install -T -D build/zm-clientuploader-store*.jar build/stage/$(NAME)/opt/zimbra/lib/clientuploader/com_zimbra_clientuploader.jar

zimbra-extension-pkg: create-extension stage-extension-jar
	../zm-pkg-tool/pkg-build.pl \
		--out-type=binary \
		--pkg-version=$(VERSION).$(shell git log --format=%at -1) \
		--pkg-release=1 \
		--pkg-name=$(NAME) \
		--pkg-summary='$(DESC)' \
		--pkg-depends='zimbra-store (>= 8.8.15)' \
		--pkg-post-install-script='scripts/postinst.sh'\
		--pkg-installs='/opt/zimbra/lib/clientuploader/com_zimbra_clientuploader.jar'

########################################################################################################

clean:
	rm -rf build
	rm -rf downloads

########################################################################################################