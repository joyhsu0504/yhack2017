import csv

# gets list of airport codes from jetblue dataset
# with open('LowestFares.csv') as lowest:
    # reader = csv.reader(lowest)
    # codes = [[]]
    # for row in reader:
        # if row[1] not in codes[0]:
            # codes[0].append(row[1])
        # if row[2] not in codes[0]:
            # codes.append(row[2])

    # with open('codes', 'w') as c:
        # writer = csv.writer(c)
        # writer.writerows(codes)
        # print(codes)

    # with open('airport_codes.csv') as csvfile:
    # airports = csv.writer(csvfile, delimiter=',',
        # quotechar='|', quoting=csv.QUOTE_MINIMAL)
    # airports.write()

def download_airports():
    codes = open('codes.csv')
    airport_location = open('airports.csv')
    codeReader = csv.reader(codes)
    airportReader = csv.reader(airport_location)
    airport_to_location = [];

    codeList = next(codeReader)
    print(codeList)
    airport_location_tuples = []
    added_airport_list = []



    for airport in airportReader:
        if airport[4] in codeList and airport[4] not in added_airport_list:
            airport_location_tuples.append([airport[3], airport[4]])
            added_airport_list.append(airport[4])

    atl = csv.writer(open('atc.csv', 'w'))
    atl.writerows(airport_location_tuples)

    print(airport_location_tuples)
    print(len(codeList))
    print(len(airport_location_tuples))




download_airports()

