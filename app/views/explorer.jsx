import React from 'react';
import { Link } from 'react-router';
import request from 'superagent';
import Modal from 'react-modal';
import TagsInput from 'react-tagsinput';
import Icon from '../partials/icon';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import Recommendation from '../partials/recommendation';
import RecommendationForm from '../partials/recommendation-form';

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
            tags: [],
            recommendations: [],
            recommendationsOpen: false
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
    openRecommendationsModal() {
        this.setState({
            recommendationsOpen: true
        });
    }
    closeRecommendationsModal() {
        this.setState({
            recommendationsOpen: false
        });
    }
    saveRecommendedTags(tags) {
        request.post('/api/tags').send(tags).end((err, res) => {
            this.setState({
                recommendationsOpen: false,
                recommendations: tags
            });
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
        request.get('/api/tags').end((err, res) => {
            if (!err) {
                this.setState({
                    recommendations: JSON.parse(res.text)
                });
            }
        });
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
                    marginRight: "50px",
                    display: "inline-flex",
                    fontSize: "1.5em"
                }}>{path.split("/").reduce((currLink, sublink, index) => {
                        if (index !== 0 && sublink === "")
                            return currLink;
                        currLink.location += `${sublink}/`;
                        currLink.links.push(<Link className="breadcrumbs" key={currLink.location} to={currLink.location}>{index === 0 ? <i className="fa fa-home" style={{
                            textDecoration: "underline"
                        }}></i> : undefined}{decodeURI(sublink)}/</Link>);
                        return currLink;
                    }, {
                        location: "",
                        links: []
                    }).links}</h1>
                <div style={{
                    position: "relative",
                    top: "-7px"
                }}><a className="tags-button" onClick={this.openRecommendationsModal.bind(this)} style={{
                boxShadow: "0 3px 10px rgba(0,0,0,0.23),0 3px 10px rgba(0,0,0,0.16)",
                border: "inherit",
                display: "block",
                background: "#448AFF",
                fontWeight: 100,
                width: "inherit",
                paddingRight: "10px",
                paddingLeft: "10px",
                marginLeft: "20px"
                }}>עריכת תגיות מומלצות</a></div>
        <div style={{
            backgroundColor: "white"
        }}>
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
                            <div style={{
                                display: "flex"
                            }}>
                            <iframe src={this.state.path + "?file&zoom=300"} style={{
                                width: "60%"
                            }}></iframe>
                        <div className="form" style={{
                            width: "30%"
                        }}>
                            <div>
                                <h2 style={{
                                    display: "inline-block",
                                    marginTop: "20px"
                                }}>ניהול פרטים ותיוג - {this.state.file}</h2>
                            </div>
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
                            <label className="flex">
                                <span className="form-label"></span>
                                <span className="">*יש ללחוץ ׳אנטר׳ כדי לקבל תגית</span>
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
                            <Recommendation recommendations={this.state.recommendations} tagClicked={this.tagClicked.bind(this)} />
                            </div>
                        </div>
                        </Modal>
                        <RecommendationForm save={this.saveRecommendedTags.bind(this)} recommendations={this.state.recommendations} isOpen={this.state.recommendationsOpen} close={this.closeRecommendationsModal.bind(this)} />
                    <div style={{
                        height: '100px',
                        clear: 'both'
                    }}></div>
                    </div>
                </div>
                );
            }
        }
