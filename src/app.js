import React, { Component } from 'react';
import Filter from './components/Filter.jsx';
import './App.css';

    static defaultProps = {
        locations: [
            {name: 'Bath & Body Works', loc: {lat: 36.2028105, lng: -86.69238539999998}, address: '448 Opry Mills Dr, Nashville, TN 37214', site: 'http://www.bathandbodyworks.com/'},
            {name: '50 East Shoes', loc: {lat: 36.20366, lng: -86.69239}, address: '509 Opry Mills Dr, Nashville, TN 37214', site: 'http://www.50eastshoes.com/'},
            {name: 'Opry Mills Mall', loc: {lat: 36.202971, lng: -86.692699}, address: '433 Opry Mills Dr, Nashville, TN 37214', site: 'https://www.simon.com/mall/opry-mills'},
            {name: 'VF Outlet', loc: {lat: 36.20366, lng: -86.69239}, address: '539 Opry Mills Dr, Nashville, TN 37214', site: 'http://vfoutlet.com/opry-mills?utm_source=google_plus&utm_medium=organic&utm_content=nashville_tn&utm_campaign=local'},
            {name: 'Zales Outlet', loc: {lat: 36.20366, lng: -86.69239}, address: '228 Opry Mills Dr, Nashville, TN 37214', site: 'https://www.zalesoutlet.com/'},
            {name: 'Solitaire the Diamond Store', loc: {lat: 36.20365849999999, lng: -86.69482479999999}, address: '158 Opry Mills Dr, Nashville, TN 37214, USA', site: 'http://www.mywatchstock.com/Category/watches/1/2909'}
        ]
    };


    class App extends Component {
    state = {
        query: '',
        map: '',
        markers: [],
        infowindow: '',
        contents: [],
        filtered: [],
        hideMarkers: []
    };

    handleFilter(query) {
        // set state of query
        this.setState({ query });
        this.state.markers.map(marker => marker.setVisible(true));

        // filter locations based on query
        if (query) {
            const filtered = this.props.locations.filter(location => location.name.toLowerCase().includes(this.state.query.toLowerCase()));
            this.setState({ filtered });

            // hide markers not searched for
            const hideMarkers = this.state.markers.filter(marker => filtered.every(filteredLocation => filteredLocation.name !== marker.title));
            hideMarkers.forEach(marker => marker.setVisible(false));
            this.setState({ hideMarkers });
        } else {
            this.state.markers.forEach(marker => marker.setVisible(true));
        }
    }

    componentDidMount() {
        const apiKey = 'AIzaSyBHc3m3XxUQIwvpgvJLji1E2-_Dob7uvGI';
        loadScript(`https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=initMap`);
        window.initMap = this.initMap.bind(this);
    }

    initMap() {
        // load up full map
        const markers = [];
        const contents = [];
        const map = new window.google.maps.Map(document.getElementById('map'), {
            center: {lat: 36.202971, lng: -86.692699},
            zoom: 12,
            mapTypeId: 'roadmap',
            mapTypeControl: false,
            streetViewControl: true
        });
        const infowindow = new window.google.maps.InfoWindow();
        this.props.locations.filter(location => location.name.toLowerCase().includes(this.state.query.toLowerCase())).forEach(location => {
            //content string for each info window
            const contentString = `
                <div class="info-content">
                    <h2>${location.name}</h2>
                </div>
                <p>Address: <a href="https://maps.google.com/?q=${location.address}">${location.address}</a></p>
                <p><a href=${location.site}>Check out the ${location.site} on the Web</a></p>
            `;
            // a marker for each location
            const marker = new window.google.maps.Marker({
                position: location.loc,
                map: map,
                title: location.name,
                animation: window.google.maps.Animation.DROP
            });
            markers.push(marker);
            contents.push(contentString);
                marker.addListener('click', function() {
                infowindow.setContent(contentString);
                infowindow.open(map, marker);
                // animate the markers on click
                marker.setAnimation(window.google.maps.Animation.BOUNCE)
                setTimeout(function() {
                    marker.setAnimation(null)
                }, 500);
            });
            map.addListener('click', function() {
                if (infowindow) {
                    infowindow.close();
                }
            })
        });
        this.setState({ map, markers, infowindow, contents });
    }

    render() {
        const {query, map, markers, contents, infowindow, filtered, hideMarkers} = this.state;
        const {locations} = this.props;
        return (
            <main className="app-container">
                <header className="header">
                    <input type="text" placeholder="Filter items" className="search" onChange={event => this.handleFilter(event.target.value)} value={query} aria-label="Filter search input" tabIndex={1} />
                    <h1 className="title">Nashville, TN near Opry Mills Mall Map</h1>
                </header>
                <Filter query={query} locations={locations} map={map} markers={markers} contents={contents} infowindow={infowindow} filtered={filtered} hideMarkers={hideMarkers} />
                <div id="map" role="application" aria-label="map"></div>
            </main>
        )
    }
}

function loadScript(url) {
    let index = window.document.getElementsByTagName('script')[0];
    let script = window.document.createElement('script');
    script.src = url;
    script.async = true;
    script.defer = true;
    index.parentNode.insertBefore(script, index);
    script.onerror = function() {
        document.write('Problems encountered while loading Map. Try again later.')
    };
}

export default App;
