// MIT © 2017 azu
// Unist spec
// https://github.com/syntax-tree/unist
export interface Node {
    type: string;
    data?: Data;
    position?: Position;
}

export interface Data {
    [index: string]: any;
}

export interface Position {
    start: Point;
    end: Point;
    index?: number;
}

export interface Point {
    line: number;
    column: number;
    offset?: number;
}

export interface Parent extends Node {
    children: Array<Node>;
}

export interface Text extends Node {
    value: string;
}
