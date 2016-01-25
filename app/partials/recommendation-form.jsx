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
    tagsChanged (tags) {
        console.log(tags);
    }
    closeModal () {
        if (this.props.close) {
            this.props.close();
        }
    }
    setTags(){}
    render () {
        return (
            <Modal
                isOpen={this.props.isOpen}>
                <div className="form">
                    <h2>עריכת תגיות מומלצות</h2>
                    <label className="flex">
                        <span className="form-label">תגיות</span>
                        <TagsInput value={this.props.recommendations} onChange={this.tagsChanged.bind(this)} style={{
                             width: '50%'
                        }} />
                    </label>
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
