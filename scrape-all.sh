#!/bin/zsh

# scrape reports
BATCH_COMMAND="stock-report" BATCH_SUBCOMMAND="scrape-naver" docker-compose up ant-sting-batch
BATCH_COMMAND="stock-report" BATCH_SUBCOMMAND="scrape-hana" docker-compose up ant-sting-batch
BATCH_COMMAND="stock-report" BATCH_SUBCOMMAND="scrape-shinhan" docker-compose up ant-sting-batch
BATCH_COMMAND="stock-report" BATCH_SUBCOMMAND="scrape-kiwoom" docker-compose up ant-sting-batch
#nest start batch -- stock-report scrape-naver
#nest start batch -- stock-report scrape-hana
#nest start batch -- stock-report scrape-shinhan
#nest start batch -- stock-report scrape-kiwoom

# scrape economic information
BATCH_COMMAND="economic-information" BATCH_SUBCOMMAND="scrape-naver" docker-compose up ant-sting-batch
BATCH_COMMAND="economic-information" BATCH_SUBCOMMAND="scrape-kcif" docker-compose up ant-sting-batch
BATCH_COMMAND="economic-information" BATCH_SUBCOMMAND="exchange-rate" docker-compose up ant-sting-batch
BATCH_COMMAND="economic-information" BATCH_SUBCOMMAND="bond-yield" docker-compose up ant-sting-batch
BATCH_COMMAND="economic-information" BATCH_SUBCOMMAND="interest-rate" docker-compose up ant-sting-batch
BATCH_COMMAND="economic-information" BATCH_SUBCOMMAND="stock-index" docker-compose up ant-sting-batch
#nest start batch -- economic-information scrape-naver
#nest start batch -- economic-information scrape-kcif
#nest start batch -- economic-information exchange-rate
#nest start batch -- economic-information bond-yield
#nest start batch -- economic-information interest-rate
#nest start batch -- economic-information stock-index

# sec related information
BATCH_COMMAND="stock" BATCH_SUBCOMMAND="scrape-sec-ticker" docker-compose up ant-sting-batch
BATCH_COMMAND="stock" BATCH_SUBCOMMAND="scrape-finra-short-interest" docker-compose up ant-sting-batch
#nest start batch -- stock scrape-sec-ticker
#nest start batch -- stock scrape-finra-short-interest


