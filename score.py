#!/usr/bin/python

# find highest final score
# find every flight that leads to destination
# check if closest airport is within 50 miles
# else connecting flight
# else error
import pandas as pd
def main():
	labels_df = pd.read_csv("Deals.csv")
	cols = ["BatchId", "OriginAirportCode", "DestinationAirportCode", "FlightDate", "FlightType", "FareType", "FinalScore", "FareDollarAmount", "TaxDollarAmount", "FarePointsAmount", "TaxPointsAmount", "IsDomesticRoute", "IsHotDeal", "IsPriceDrop", "PriceDropFromDollarAmount", "LastDayOfFare", "DaysOfWeek", "IsNewPriceDrop"]
	#for label in cols:
	#	labels_df[label] = labels_df['tags'].apply(lambda x: 1 if label in x.split(' ') else 0)
		
	dropCols = [0, 3, 11, 12, 13, 14, 15, 16, 17]
	for dropCol in dropCols:
		labels_df = labels_df.drop(cols[dropCol], axis=1)
		
	print labels_df
	
	highestScore(labels_df)
	returnAirports(labels_df, "LAX")

    #labels_df = labels_df.drop(labels_df.index[errors])

	#labels_df = labels_df[cols]

	#y_train = labels_df.values

def returnAirports(labels_df, destinationCode):
	print labels_df.loc[labels_df['DestinationAirportCode'] == destinationCode]

def highestScore(labels_df):
	print labels_df.loc[labels_df['FinalScore'].idxmax()]

if __name__ == '__main__':
	main()