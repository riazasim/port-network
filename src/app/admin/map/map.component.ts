import { Component, OnInit, ViewChild } from '@angular/core';
import { MapInfoWindow, MapMarker } from '@angular/google-maps';

@Component({
    selector: 'app-map',
    templateUrl: 'map.component.html',
})
export class MapComponent implements OnInit {
    @ViewChild(MapInfoWindow) infoWindow: MapInfoWindow | undefined;
    markerPositions: google.maps.LatLngLiteral[] = [];
    display: any;

    center: google.maps.LatLngLiteral = {
        lat: 44.136797039769284,
        lng: 28.646488129424217,
    };
    zoom = 13;

    constructor() {}
    ngOnInit() {}

    addMarker(event: google.maps.MapMouseEvent) {
        this.markerPositions = [];
        console.log(this.markerPositions);

        if (event.latLng != null)
            this.markerPositions.push(event.latLng.toJSON());
    }
    openInfoWindow(marker: MapMarker) {
        if (this.infoWindow != undefined) this.infoWindow.open(marker);
    }

    moveMap(event: google.maps.MapMouseEvent) {
        if (event.latLng != null) this.center = event.latLng.toJSON();
    }
    move(event: google.maps.MapMouseEvent) {
        if (event.latLng != null) this.display = event.latLng.toJSON();
    }
}
