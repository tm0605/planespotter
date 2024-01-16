import json

def read_json_file(file_path):
    with open(file_path, 'r', encoding='utf-8') as file:
        return json.load(file)

def write_geojson_file(data, file_path):
    with open(file_path, 'w') as file:
        json.dump(data, file, indent=4)

def convert_to_geojson(data):
    geojson = {
        "type": "FeatureCollection",
        "features": []
    }

    for entry in data["response"]:
        feature = {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [entry["lng"], entry["lat"]]
            },
            "properties": {
                "name": entry["name"],
                "iata_code": entry["iata_code"],
                "icao_code": entry["icao_code"],
                "country_code": entry["country_code"]
            }
        }
        geojson["features"].append(feature)
    
    return geojson

def classify_airports(data):
    major_airports = []
    other_airports = []

    for airport in data["response"]:
        if airport["iata_code"] is not None:
            major_airports.append(airport)
        else:
            other_airports.append(airport)

    return major_airports, other_airports

# Path to your input JSON file
input_file_path = 'airport.json'

output_major_airports_file_path = 'major_airports.geojson'
output_other_airports_file_path = 'other_airports.geojson'

original_data = read_json_file(input_file_path)

# Classify the airports
major_airports, other_airports = classify_airports(original_data)

# Convert to GeoJSON
major_airports_geojson = convert_to_geojson({"response": major_airports})
other_airports_geojson = convert_to_geojson({"response": other_airports})

# Write to .geojson files
write_geojson_file(major_airports_geojson, output_major_airports_file_path)
write_geojson_file(other_airports_geojson, output_other_airports_file_path)