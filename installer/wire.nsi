Unicode True
SetCompressor /SOLID lzma

!include "MUI2.nsh"

Name "WIRE"
Caption "WIRE Setup"
BrandingText "WIRE"
OutFile "/workspace/artifacts/WIRESetup.exe"
RequestExecutionLevel user
InstallDir "$LOCALAPPDATA\WIRE"
InstallDirRegKey HKCU "Software\WIRE" "InstallDir"

!define MUI_ICON "/tmp/wire-icon.ico"
!define MUI_UNICON "/tmp/wire-icon.ico"
!define MUI_ABORTWARNING
!define MUI_WELCOMEPAGE_TITLE "Welcome to WIRE Setup"
!define MUI_WELCOMEPAGE_TEXT "This will install WIRE on your PC.$\r$\n$\r$\nWIRE is your private desktop messenger — one account, yours. Chats stay on this computer.$\r$\n$\r$\nClick Next to continue."
!define MUI_FINISHPAGE_TITLE "WIRE is installed"
!define MUI_FINISHPAGE_TEXT "WIRE is ready to open."
!define MUI_FINISHPAGE_RUN "$INSTDIR\WIRE.exe"
!define MUI_FINISHPAGE_RUN_TEXT "Launch WIRE"

!insertmacro MUI_PAGE_WELCOME
!insertmacro MUI_PAGE_DIRECTORY
!insertmacro MUI_PAGE_INSTFILES
!insertmacro MUI_PAGE_FINISH
!insertmacro MUI_UNPAGE_CONFIRM
!insertmacro MUI_UNPAGE_INSTFILES
!insertmacro MUI_LANGUAGE "English"

VIProductVersion "1.0.0.0"
VIFileVersion "1.0.0.0"
VIAddVersionKey "ProductName" "WIRE"
VIAddVersionKey "CompanyName" "WIRE"
VIAddVersionKey "FileDescription" "WIRE Setup"
VIAddVersionKey "FileVersion" "1.0.0"
VIAddVersionKey "LegalCopyright" "WIRE"
VIAddVersionKey "OriginalFilename" "WIRESetup.exe"

Section "Install"
  SetOutPath "$INSTDIR"
  File /r "/tmp/wire-payload/*"
  WriteUninstaller "$INSTDIR\Uninstall.exe"
  CreateShortcut "$DESKTOP\WIRE.lnk" "$INSTDIR\WIRE.exe" "" "$INSTDIR\WIRE.exe" 0
  CreateDirectory "$SMPROGRAMS\WIRE"
  CreateShortcut "$SMPROGRAMS\WIRE\WIRE.lnk" "$INSTDIR\WIRE.exe" "" "$INSTDIR\WIRE.exe" 0
  CreateShortcut "$SMPROGRAMS\WIRE\Uninstall WIRE.lnk" "$INSTDIR\Uninstall.exe"
  WriteRegStr HKCU "Software\WIRE" "InstallDir" "$INSTDIR"
  WriteRegStr HKCU "Software\Microsoft\Windows\CurrentVersion\Uninstall\WIRE" "DisplayName" "WIRE"
  WriteRegStr HKCU "Software\Microsoft\Windows\CurrentVersion\Uninstall\WIRE" "DisplayVersion" "1.0.0"
  WriteRegStr HKCU "Software\Microsoft\Windows\CurrentVersion\Uninstall\WIRE" "Publisher" "WIRE"
  WriteRegStr HKCU "Software\Microsoft\Windows\CurrentVersion\Uninstall\WIRE" "UninstallString" "$\"$INSTDIR\Uninstall.exe$\""
  WriteRegStr HKCU "Software\Microsoft\Windows\CurrentVersion\Uninstall\WIRE" "DisplayIcon" "$INSTDIR\WIRE.exe"
  WriteRegDWORD HKCU "Software\Microsoft\Windows\CurrentVersion\Uninstall\WIRE" "NoModify" 1
  WriteRegDWORD HKCU "Software\Microsoft\Windows\CurrentVersion\Uninstall\WIRE" "NoRepair" 1
SectionEnd

Section "Uninstall"
  Delete "$DESKTOP\WIRE.lnk"
  Delete "$SMPROGRAMS\WIRE\WIRE.lnk"
  Delete "$SMPROGRAMS\WIRE\Uninstall WIRE.lnk"
  RMDir "$SMPROGRAMS\WIRE"
  RMDir /r "$INSTDIR"
  DeleteRegKey HKCU "Software\Microsoft\Windows\CurrentVersion\Uninstall\WIRE"
  DeleteRegKey HKCU "Software\WIRE"
SectionEnd
