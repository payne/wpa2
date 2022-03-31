export class Vote {
    id: string;
    storyId: string;
    points: number;

    constructor(id: string, storyId: string, points: number) {
        this.id = id;
        this.storyId = storyId;
        this.points = points;
    }
}