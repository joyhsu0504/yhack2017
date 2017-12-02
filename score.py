#!/usr/bin/python
from math import cos, asin, sqrt
import pandas as pd
def main():
	labels_df = pd.read_csv("Deals.csv")
	cols = ["BatchId", "OriginAirportCode", "DestinationAirportCode", "FlightDate", "FlightType", "FareType", "FinalScore", "FareDollarAmount", "TaxDollarAmount", "FarePointsAmount", "TaxPointsAmount", "IsDomesticRoute", "IsHotDeal", "IsPriceDrop", "PriceDropFromDollarAmount", "LastDayOfFare", "DaysOfWeek", "IsNewPriceDrop"]
		
	dropCols = [0, 3, 11, 12, 13, 14, 15, 16, 17]
	for dropCol in dropCols:
		labels_df = labels_df.drop(cols[dropCol], axis=1)
		
	print labels_df
	
	labels_df = returnAirports(labels_df, "LAX")
	print 'new labels'
	print labels_df
	#originAirports = labels_df.loc[[1]].values
	originAirports = labels_df['OriginAirportCode'].values
	print 'origin airports' + originAirports
	closestAirport = findClosestAirport(originAirports, 60, 160) #change currLoc
	print 'closest airport' + closestAirport
	lables_df = findMatch(labels_df, "LAX", closestAirport)
	labels_df = highestScore(labels_df)

def findCoordinate(locName):
	code_df = pd.read_csv("airportcodes.csv")
	code_df = code_df.loc[code_df['locationID'] == locName]
	return code_df['Latitude'].values, code_df['Longitude'].values
	
def findDistance(lat1, lon1, lat2, lon2):
	p = 0.017453292519943295     #Pi/180
	a = 0.5 - cos((lat2 - lat1) * p)/2 + cos(lat1 * p) * cos(lat2 * p) * (1 - cos((lon2 - lon1) * p)) / 2
	return 12742 * asin(sqrt(a)) #2*R*asin

def findMatch(labels_df, originCode, destinationCode):
	labels_df = labels_df.loc[labels_df['DestinationAirportCode'] == destinationCode]
	labels_df = labels_df.loc[labels_df['OriginAirportCode'] == originCode]
	return labels_df

def findClosestAirport(allLoc, currLocationLat, currLocationLon):
	lat1, lon1 = findCoordinate(allLoc[0])
	closestDistance = findDistance(lat1, lon1, currLocationLat, currLocationLon)
	closestAirport = allLoc[0]
	for i in range(1, len(allLoc)):
		lat1, lon1 = findCoordinate(allLoc[i])
		currDistance = findDistance(lat1, lon1, currLocationLat, currLocationLon)
		if (currDistance < closestDistance):
			closestDistance = currDistance
			closestAirport = allLoc[0]
	return closestAirport
	

def returnAirports(labels_df, destinationCode):
	print labels_df.loc[labels_df['DestinationAirportCode'] == destinationCode]
	return labels_df.loc[labels_df['DestinationAirportCode'] == destinationCode]

def highestScore(labels_df):
	print labels_df.loc[labels_df['FinalScore'].idxmax()]
	return labels_df.loc[labels_df['FinalScore'].idxmax()]

if __name__ == '__main__':
	main()