import React from 'react';
import { Link } from 'react-router';
import request from 'superagent';

export default class Explorer extends React.Component {
    static propTypes = {
        setFiles: React.PropTypes.func,
        files: React.PropTypes.array
    }
    constructor(props) {
        super(props);
        this.state = {
            isEdit: false
        };
        this.statPath = this.statPath.bind(this);
        this.editTags = this.editTags.bind(this);
        this.setTags = this.setTags.bind(this);
    }
    statPath(path) {
        request.get(path).end((err, res) => {
            if (!err) {
                this.props.setFiles(JSON.parse(res.text));
            } else {
                this.props.setFiles([]);
            }
        });
    }
    editTags(path) {
        request.get(path).end((err, res) => {
            if (!err) {
                this.setState({
                    isEdit: true,
                    path,
                    tags: JSON.parse(res.text).tags
                });
            }
        });
    }
    setTags(path) {
        request.post(path).send({tags: this.refs.input.value}).end((err, res) => {
            this.setState({
                isEdit: false
            });
        });
    }
    componentWillMount() {
        this.statPath('/api' + this.props.location.pathname);
    }
    componentWillReceiveProps(nextProps) {
        if (this.props.location.pathname !== nextProps.location.pathname) {
            let path = '/api' + nextProps.location.pathname;
            this.statPath(path);
        }
    }
    render() {
        let path = this.props.location.pathname;
        if (path[path.length - 1] === '/')
            path = path.substr(0, path.length - 1);
        return (
            <div>
                <h1>{path.split("/").reduce((currLink, sublink, index) => {
                        if (index !== 0 && sublink === "")
                            return currLink;
                        currLink.location += `${sublink}/`;
                        currLink.links.push(<Link key={currLink.location} to={currLink.location}>{sublink}/</Link>);
                        return currLink;
                    }, {
                        location: "",
                        links: []
                    }).links}</h1>
                    <hr />
                    { this.props.files && !this.state.isEdit ?
                        <ul style={{
                                listStyle: 'none'
                            }}>
                            { this.props.files.map(file => (
                                <li key={file}>
                                    { file.length - 1 !== file.lastIndexOf('/') && file.length - 1 !== file.lastIndexOf('\\')
                                        ? <a onClick={this.editTags.bind(this, `/api${path}/${file}`)}>{file}</a>
                                    : <Link to={`${path}/${file}`}>{file}</Link> }
                                </li>
                            ))}
                        </ul>
                        : undefined }
                    { this.state.isEdit ?
                        <div>
                            <textarea ref="input" rows="4" cols="50" defaultValue={this.state.tags} />
                            <br />
                            <input type="submit" onClick={this.setTags.bind(this, this.state.path)} value="Submit Tags" />
                        </div>
                    : undefined }
                    </div>
                );
            }
        }
