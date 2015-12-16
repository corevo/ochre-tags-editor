import React from 'react';

export default class Explorer extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <h1>{this.props.location.pathname.split("/").reduce((currLink, sublink, index) => {
                        if (index !== 0 && sublink === "")
                            return currLink;
                        currLink.location += `${sublink}/`;
                        currLink.links.push(<a key={currLink.location} href={currLink.location}>{sublink}/</a>);
                        return currLink;
                    }, {
                        location: "",
                        links: []
                    }).links}</h1>
            </div>
        );
    }
}
