#!/bin/bash

cd  dist
zip pla.war  -r ./*
/home/fang/upload_ftp.sh 123.56.93.253 root Fzy1997727 pla.war /opt/apache-tomcat-9.0.44/webapps  put 
