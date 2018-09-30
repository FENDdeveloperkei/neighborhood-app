import React, { Component } from 'react';

class Filter extends Component {
    handleClicks(location) {
        const {infowindow, map, contents, markers} = this.props;
        // markers for the specific location names 
        markers.filter(marker => marker.title === location.name).forEach(marker => {
            infowindow.setContent(String(contents.filter(content => String(content).slice(5).includes(location.name))));
            infowindow.open(map, marker);
            // animation for marker when it is clicked
            marker.setAnimation(window.google.maps.Animation.BOUNCE)
            setTimeout(function() {
                marker.setAnimation(null)
            }, 500)
        });
    }

    render() {
        const {locations, query} = this.props;
        return (
            <div className="content" aria-label="Everything Near Opry Mills Mall in Nashville, TN">
                <ul>
                    {locations
                        .filter(location => location.name.toLowerCase().includes(query.toLowerCase()))
                        .map((location, index) => {
                            return <li className="list-item" key={index} onClick={this.handleClicks.bind(this, location)} tabIndex={1}>{location.name}</li>})
                    }
                </ul>
            </div>
        )
    }
}

export default Filter;