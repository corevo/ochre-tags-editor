import React from 'react';
import TagsInput from 'react-tagsinput';
import Modal from 'react-modal';

export default class RecommendationsForm extends React.Component {
    static propTypes = {
        recommendations: React.PropTypes.array.isRequired,
        close: React.PropTypes.func,
        isOpen: React.PropTypes.bool
    };
    static defaultProps = {
        isOpen: true
    };
    constructor(props) {
        super(props);
        this.state = {
            tags: [],
            newTags: []
        }
    }
    tagsChanged (tags) {
        this.setState({
            tags
        });
    }
    newTagsChanged (tags) {
        this.setState({
            newTags: tags
        });
    }
    closeModal () {
        if (this.props.close) {
            this.props.close();
        }
    }
    assignTags () {
        this.setState({
            tags: [...this.state.tags, ...this.state.newTags],
            newTags: []
        });
    }
    setTags(){
        if (this.props.save && this.state.tags) {
            this.props.save(this.state.tags);
        }
    }
    componentWillReceiveProps(nextProps) {
        this.setState({
            tags: nextProps.recommendations
        });
    }
    render () {
        return (
            <Modal
                isOpen={this.props.isOpen}>
                <div className="form">
                    <h2>עריכת תגיות מומלצות</h2>
                    <div>
                        <label className="flex">
                            <span className="form-label">תגיות קיימות</span>
                            <TagsInput value={this.state.tags} onChange={this.tagsChanged.bind(this)} style={{
                                width: '50%'
                            }} />
                        </label>
                        <label className="flex">
                            <span className="form-label">תגיות חדשות</span>
                            <TagsInput value={this.state.newTags} onChange={this.newTagsChanged.bind(this)} style={{
                                width: '50%'
                            }} />
                        </label>
                        <button onClick={this.assignTags.bind(this)} className="tags-button" style={{
                                borderColor: '#638421',
                                background: '#96BF43',
                                marginRight: '20px'
                            }}>הוספה</button>
                    </div>
                    <hr style={{
                            clear: "both",
                            marginTop: "60px"
                        }} />
                    <button onClick={this.setTags.bind(this)} className="tags-button" style={{
                            borderColor: '#638421',
                            background: '#96BF43',
                            marginRight: '20px'
                        }}>שמור</button>
                    <button onClick={this.closeModal.bind(this)} className="tags-button">סגור</button>
                </div>
            </Modal>
        );
    }
}
