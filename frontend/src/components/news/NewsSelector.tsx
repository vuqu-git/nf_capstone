// NewsSelector.tsx (shared component)
import { Form } from "react-bootstrap";
import { News } from "../../types/News.ts";

interface Props {
    allNews: News[];
    selectedId: string;
    onSelect: (idInSelectOption: string) => void;
}

export const NewsSelector = ({ allNews, selectedId, onSelect }: Props) => (
    <Form.Group>
        <Form.Label>Select a News Entry</Form.Label>
        <Form.Select
            value={selectedId}
            onChange={(e) => onSelect(e.target.value)}
            disabled={!allNews.length}
        >
            <option value="">Select here...</option>
            {allNews.map((news) => (
                <option key={news.id} value={news.id}>
                    ⌛ {news.endDate} | {news.text}
                </option>
            ))}
        </Form.Select>
    </Form.Group>
);
