#!/bin/zsh

# scrape reports
nest start batch -- stock-report scrape-naver
nest start batch -- stock-report scrape-hana
nest start batch -- stock-report scrape-shinhan
nest start batch -- stock-report scrape-kiwoom

# scrape economic information
nest start batch -- economic-information scrape-naver
nest start batch -- economic-information scrape-kcif
nest start batch -- economic-information exchange-rate
nest start batch -- economic-information bond-yield
nest start batch -- economic-information interest-rate
nest start batch -- economic-information stock-index

# sec related information
nest start batch -- stock scrape-sec-ticker
nest start batch -- stock scrape-finra-short-interest
