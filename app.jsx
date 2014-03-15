/** @jsx React.DOM */

function s4() {
  return Math.floor((1 + Math.random()) * 0x10000)
             .toString(16)
             .substring(1);
};

function guid() {
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
         s4() + '-' + s4() + s4() + s4();
}

// var simperium = new Simperium("buzzer-distortion-080", { token : "2edfec6cd3a04759804773c6672b9abf"});

// var bucket = simperium.bucket("shacks");


var fb = new Firebase("https://shack-rating.firebaseio.com/")

var sum = function(array) {
    return _.reduce(array, function(sum, num) {
        return sum + num;
    });
} 


var Shacks = React.createClass({
    render: function() {
        var shacks = _.map(this.props.shacks, function(shack, id) {
            var rating = Math.round(sum(shack.ratings)/shack.ratings.length);
            return (<Shack addRating={this.props.addRating} description={shack.description} title={shack.title} url={shack.url} rating={rating} key={shack.id} guid={id} />)
        }.bind(this))
        return (<div>{shacks}</div>);
      }
});


var Shack = React.createClass({
    render: function() {
        return (
            <div>
                <h2>{this.props.title}</h2>
                <img src={this.props.url} alt={this.props.title} />
                <p>{this.props.description}</p>
                <Rating rating={this.props.rating} />
                <MyRating guid={this.props.guid} addRating={this.props.addRating} rating={this.props.rating} />
            </div>
        );
      }
});


var MyRating = React.createClass({
    render: function() {
        var stars = _.map(_.range(5), function(i) {
            return (<a href="#" className="rating" key={i} onClick={this.props.addRating.bind(null, this.props.guid, i)}>&#9733;</a>);
        }.bind(this))
        return (
            <div>{stars}</div>
        );
      }
});

var Rating = React.createClass({
    render: function() {
        var stars = _.map(_.range(this.props.rating), function(i) {
            return (<span className="rating" key={i}>&#9733;</span>);
        })
        return (
            <div>{stars}</div>
        );
      }
});

var Page = React.createClass({

    componentWillMount: function() {
        fb.on("value", function(data) {
            if (data.val() != null && !_.isEqual(data.val().shacks, this.state.shacks)) {
                this.setState({shacks: data.val().shacks});
            }
        }.bind(this))
    },

    componentDidUpdate: function(prevProps, prevState) {
        fb.set({shacks: this.state.shacks})
    },

    addRating: function(guid, rating, e) {
        e.preventDefault();
        var shacks = this.state.shacks;
        shacks[guid].ratings.push(rating+1);
        this.setState({shacks: shacks});
    },

    getInitialState: function() {
        return {
            shacks: {
 
            }
        };
    },

    newShack: function(e) {
        e.preventDefault();
        var shacks = this.state.shacks;
        shacks[guid()] = {
            url: this.refs.url.getDOMNode().value,
            title: this.refs.title.getDOMNode().value,
            description: this.refs.description.getDOMNode().value,
            ratings: [3]
        }
        this.setState({shacks: shacks})
        e.target.reset()
    },


    render: function() {
        return (
            <div>
                <h1>Rate That Shack!!!</h1>
                <div className="col-md-5">
                    <Shacks addRating={this.addRating} shacks={this.state.shacks} />
                </div>
                <form className="col-md-5" onSubmit={this.newShack}>
                    <div className="form-group">
                        <div className="form-group">
                            <input ref="url" placeholder="http://urlfortheawesomesha.ck/shack.jpg" type="text" />
                        </div>
                        <div className="form-group">
                            <input ref="title" placeholder="Title for the Awesome Shack" type="text" />
                        </div>
                        <div className="form-group">
                            <textarea  ref="description" className="form-control" rows="4" placeholder="Description of the Awesome Shack"></textarea>
                        </div>
                        <div className="form-group">
                            <input className="btn btn-primary pull-right" type="submit" value="Submit Awesome Shack"  />
                        </div>
                    </div>
                </form>
            </div>
        );
      }
});



React.renderComponent(
    <Page />,
    document.getElementById("root")
);
