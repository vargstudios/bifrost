call "C:\Program Files (x86)\Microsoft Visual Studio\2019\Community\VC\Auxiliary\Build\vcvarsall.bat" x64
call gradlew clean
call gradlew build --info "-Dquarkus.native.container-runtime=" "-Dquarkus.native.graalvm-home=C:\dev\graalvm-ce-java11-21.0.0"
