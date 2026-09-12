@echo off
setlocal

echo Building backend...
cd ..\backend
call mvnw.cmd clean package -DskipTests
if errorlevel 1 goto :error

echo Building frontend...
cd ..\frontend
call npm run build
if errorlevel 1 goto :error

echo Copying frontend build into Spring Boot static...
rmdir /S /Q ..\backend\src\main\resources\static
mkdir ..\backend\src\main\resources\static
xcopy /E /I /Y dist\* ..\backend\src\main\resources\static\
if errorlevel 1 goto :error

echo Rebuilding backend with frontend included...
cd ..\backend
call mvnw.cmd clean package -DskipTests
if errorlevel 1 goto :error

echo Building Wails app...
cd ..\shell
call wails build
if errorlevel 1 goto :error

echo Copying jar next to the built executable...
copy /Y ..\backend\target\wilo-0.0.1.jar build\bin\wilo-0.0.1.jar
if errorlevel 1 goto :error

echo Done. Executable + jar are together in shell\build\bin\
goto :eof

:error
echo Build failed.
exit /b 1