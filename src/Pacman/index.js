import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { EAST, NORTH, WEST, SOUTH } from './constants';
import getInitialState from './state';
import { animate, changeDirection } from './game';
import Board from './Board';
import Scores from './Scores';
import AllFood from './AllFood';
import Monster from './Monster';
import Player from './Player';
import './style.scss';

export default class Pacman extends Component {
    constructor(props) {
        super(props);

        this.state = getInitialState();

        this.onKey = evt => {
            if (evt.key === 'ArrowRight') {
                return this.changeDirection(EAST);
            }
            if (evt.key === 'ArrowUp') {
                return this.changeDirection(NORTH);
            }
            if (evt.key === 'ArrowLeft') {
                return this.changeDirection(WEST);
            }
            if (evt.key === 'ArrowDown') {
                return this.changeDirection(SOUTH);
            }

            return null;
        };

        this.timers = {
            start: null,
            animate: null
        };
    }
    componentDidMount() {
        window.addEventListener('keydown', this.onKey);

        this.timers.start = setTimeout(() => {
            this.step();
        }, 3000 * (this.props.animate >> 0));
    }
    componentWillUnmount() {
        window.removeEventListener('keydown', this.onKey);

        clearTimeout(this.timers.start);
        clearTimeout(this.timers.animate);
    }
    step() {
        const result = animate(this.state);

        this.setState(result);

        clearTimeout(this.timers.animate);
        this.timers.animate = setTimeout(() => this.step(), 20);
    }
    changeDirection(direction) {
        this.setState(changeDirection(this.state, { direction }));
    }
    render() {
        const monsters = this.state.monsters.map(({ id, ...monster }) => (
            <Monster key={id} {...this.props} {...monster} />
        ));

        return (
            <div className="pacman">
                <Board {...this.props} />
                <Scores score={this.state.score} lost={this.state.lost} />
                <AllFood {...this.props} food={this.state.food} />
                {monsters}
                <Player {...this.props} {...this.state.player} lost={this.state.lost} />
            </div>
        );
    }
}

Pacman.propTypes = {
    animate: PropTypes.bool,
    gridSize: PropTypes.number.isRequired
};

