TIMESTAMP=$(date +%s)
DIR=./analytics_store_exports
npx wrangler d1 export analytics-store --remote --output=$DIR/$TIMESTAMP.sql
cat $DIR/$TIMESTAMP.sql | sqlite3 $DIR/$TIMESTAMP.db
