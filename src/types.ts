export type Condition = number | { eq?: number; gt?: number; gte?: number; lt?: number; lte?: number };
export interface StateEffects { [key: string]: number | StateEffects }
export type Conditions = Record<string, Condition | Record<string, Condition>>;
export type Choice = { text: string; next: string; conditions?: Conditions; effects?: StateEffects };
export type Node = { id: string; background?: string; speaker?: string; text: string; choices?: Choice[]; ending?: { id?: string; title: string; text?: string } };
export type Story = { version: string; startNode: string; characters: Record<string, string>; nodes: Node[] };
