@echo off
setlocal

echo Building backend...
cd ..\backend
call mvnw.cmd clean package -DskipTests
if errorlevel 1 goto :error

echo Copying jar to shell...
if not exist ..\shell\backend mkdir ..\shell\backend
copy /Y target\wilo-0.0.1.jar ..\shell\backend\wilo-0.0.1.jar
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
copy /Y target\wilo-0.0.1.jar ..\shell\backend\wilo-0.0.1.jar

echo Building Wails app...
cd ..\shell
call wails build
if errorlevel 1 goto :error

echo Done. Executable in shell\build\bin\
goto :eof

:error
echo Build failed.
exit /b 1