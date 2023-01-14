import React, { Component } from "react";

class Card extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div className="card" style={{width: "18rem"}}>
                <div className="card-body">
                    <h5 className="card-title">{this.props.eventId}</h5>
                    <h6 className="card-subtitle mb-2 text-muted">Card subtitle</h6>
                    <p className="card-text">Some quick example text to build on the card title and make up the bulk of
                        the card's content.</p>
                    <a href="#" className="card-link">Card link</a>
                    <a href="#" className="card-link">Another link</a>
                    <button onClick={this.props.rsvpForEvent}>
                        RSVP for Event
                    </button>
                    <button onClick={this.props.attendEvent}>
                        Attend Event
                    </button>
                </div>
            </div>
        );
    }
}

export default Card;