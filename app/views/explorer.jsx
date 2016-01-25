import React from 'react';
import { Link } from 'react-router';
import request from 'superagent';
import Modal from 'react-modal';
import TagsInput from 'react-tagsinput';
import Icon from '../partials/icon';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import Recommendation from '../partials/recommendation';

require('react-datepicker/dist/react-datepicker.css');
const format = "D/M/YYYY";
moment.format = format;
moment.locale('he');

export default class Explorer extends React.Component {
    static propTypes = {
        setFiles: React.PropTypes.func,
        files: React.PropTypes.array
    };
    constructor(props) {
        super(props);
        this.state = {
            isEdit: false,
            error: '',
            tags: []
        };
        this.statPath = this.statPath.bind(this);
        this.editTags = this.editTags.bind(this);
        this.setTags = this.setTags.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.dateChanged = this.dateChanged.bind(this);
    }
    closeModal() {
        this.setState({
            isEdit: false
        });
    }
    tagsChanged(tags) {
        this.setState({
            tags
        });
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
    dateChanged(date) {
        this.setState({
            error: date ? '' : 'error',
            date: date ? date : this.state.date
        });
    }
    tagClicked(tag) {
        this.state.tags.push(tag);
        this.forceUpdate();
    }
    editTags(path, file) {
        request.get(path).end((err, res) => {
            if (!err) {
                let stats = JSON.parse(res.text);
                this.setState({
                    isEdit: true,
                    path,
                    date: stats.date ? moment(new Date(stats.date)) : undefined,
                    author: stats.author,
                    unit: stats.unit,
                    tags: stats.tags,
                    file
                });
            }
        });
    }
    setTags(path) {
        let stats = {
            tags: this.state.tags,
            author: this.refs.author.value,
            unit: this.refs.unit.value
        };
        if (!this.state.error && this.state.date){
            stats.date = this.state.date.toDate();
        }
        request.post(path).send(stats).end((err, res) => {
            this.setState({
                isEdit: false
            });
        });
    }
    componentWillMount() {
        this.statPath('/api/files' + this.props.location.pathname);
    }
    componentWillReceiveProps(nextProps) {
        if (this.props.location.pathname !== nextProps.location.pathname) {
            let path = '/api/files' + nextProps.location.pathname;
            this.statPath(path);
        }
    }
    render() {
        let path = this.props.location.pathname;
        if (path[path.length - 1] === '/')
            path = path.substr(0, path.length - 1);
        return (
            <div>
                <h1 style={{
                    marginRight: "50px"
                }}>{path.split("/").reduce((currLink, sublink, index) => {
                        if (index !== 0 && sublink === "")
                            return currLink;
                        currLink.location += `${sublink}/`;
                        currLink.links.push(<Link key={currLink.location} to={currLink.location}>{index === 0 ? <i className="fa fa-home" style={{
                            textDecoration: "underline"
                        }}></i> : undefined}{decodeURI(sublink)}/</Link>);
                        return currLink;
                    }, {
                        location: "",
                        links: []
                    }).links}</h1>
                    <hr />
                    { this.props.files ?
                        <ul style={{
                                listStyle: 'none'
                            }}>
                            { this.props.files.map(file => (
                                <li key={file} style={{
                                    display: 'inline-table',
                                    marginRight: '60px',
                                    marginTop: '60px',
                                    fontSize: '20px'
                                }}>
                                    { file.length - 1 !== file.lastIndexOf('/') && file.length - 1 !== file.lastIndexOf('\\')
                                        ? <a onClick={this.editTags.bind(this, `/api/files${path}/${file}`, file)}>
                                          <Icon ext={file.substr(file.lastIndexOf('.') + 1)} />
                                    <div style={{
                                        display: 'block',
                                        textAlign: 'center',
                                        width: '200px',
                                        wordWrap: 'break-word'
                                    }}>{file}</div></a>
                                : <Link to={`${path}/${file}`} style={{
                                    textDecoration: 'none',
                                    color: 'black'
                                }}>
                                    <Icon isFolder={true} />
                                    <div style={{
                                        display: 'block',
                                        textAlign: 'center',
                                        width: '200px',
                                        wordWrap: 'break-word'
                                    }}>{file}</div></Link> }
                                </li>
                            ))}
                        </ul>
                        : undefined }
                        <Modal
                            isOpen={this.state.isEdit}>
                            <div className="form">
                            <h2>ניהול פרטים ותיוג - {this.state.file}</h2>
                            <label className="flex">
                                <span className="form-label">תאריך המסמך</span>
                                <DatePicker ref="date" onChange={this.dateChanged} weekStart="0" weekdays={['א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ש']}  locale="he" dateFormat={format} className={`form-input ${this.state.error}`} selected={this.state.date} />
                            </label>
                            <label className="flex">
                                <span className="form-label">מחבר</span>
                                <input ref="author" defaultValue={this.state.author} className="form-input" type="text" />
                            </label>
                            <label className="flex">
                                <span className="form-label">יחידה</span>
                                <input ref="unit" defaultValue={this.state.unit} className="form-input" type="text" />
                            </label>
                            <label className="flex">
                                <span className="form-label">תגיות</span>
                                <TagsInput value={this.state.tags} onChange={this.tagsChanged.bind(this)} style={{
                                        width: '50%'
                                    }} />
                            </label>
                            <button onClick={this.setTags.bind(this, this.state.path)} className="tags-button" style={{
                                    borderColor: '#638421',
                                    background: '#96BF43',
                                    marginRight: '20px'
                                }}>שמור</button>
                            <button onClick={this.closeModal} className="tags-button">סגור</button>
                            <hr style={{
                                    clear: 'both',
                                    marginTop: '60px'
                                }} />
                            <h3>תיוגים מומלצים</h3>
                            <Recommendation recommendations={['צהל', 'ישראל']} tagClicked={this.tagClicked.bind(this)} />
                            </div>
                        </Modal>
                    <div style={{
                        height: '100px',
                        clear: 'both'
                    }}></div>
                    </div>
                );
            }
        }
