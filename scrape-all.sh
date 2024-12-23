#!/bin/zsh

nest start batch -- stock scrape-naver
nest start batch -- stock scrape-hana
nest start batch -- stock scrape-shinhan
nest start batch -- stock scrape-kiwoom
nest start batch -- economic-information scrape-naver
nest start batch -- economic-information scrape-kcif
nest start batch -- economic-information exchange-rate
nest start batch -- economic-information bond-yield
