import React, { useState, useEffect } from 'react';
//import './GroupDetails.css';
//import ReactPaginate from 'react-paginate';
//import { useParams } from 'react-router-dom';
import useUser from '../context/useUser.js';
//import { useCallback } from 'react';
import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:3001';

const AddShowtime = ({ groupId }) => {
    const { user } = useUser(); // Sử dụng context để lấy thông tin người dùng
    const [showTime, setShowTime] = useState([]);
    const [selectedShowTimes, setSelectedShowTimes] = useState({}); // Lưu trạng thái checkbox

    // URL API cho Showtime
    const url = `https://www.finnkino.fi/xml/Schedule/`;

    // Lấy dữ liệu showtime từ API
    useEffect(() => {
        fetch(url)
            .then((res) => res.text())
            .then((data) => {
                const parser = new DOMParser();
                const dataDocument = parser.parseFromString(data, 'application/xml');

                const showstime = Array.from(
                    dataDocument.getElementsByTagName('Show')
                ).map((show) => ({
                    id: show.getElementsByTagName('ID')[0]?.textContent, // ID duy nhất
                    title: show.getElementsByTagName('Title')[0]?.textContent,
                    showStart: show.getElementsByTagName('dttmShowStart')[0]?.textContent,
                    showEnd: show.getElementsByTagName('dttmShowEnd')[0]?.textContent,
                    image: show.getElementsByTagName('EventMediumImagePortrait')[0]?.textContent,
                }));

                setShowTime(showstime);
            })
            .catch((err) => {
                console.error('Error fetching showtime:', err);
            });
    }, [url]);

    // Thay đổi trạng thái checkbox khi người dùng chọn showtime
    const handleCheckboxChangeShowTimes = (showId) => {
        setSelectedShowTimes((prev) => ({
            ...prev,
            [showId]: !prev[showId], // Toggle trạng thái checkbox
        }));
    };

    // Xử lý khi submit các showtime được chọn
    const handleSubmitShowTimes = () => {
        
        //const selected = showTime.filter((item) => selectedShowTimes[item.id]);
        const selectedShowTimesData = showTime
        ?.filter((show) => selectedShowTimes[show.id]) // Chỉ lấy những showtime được chọn
        .map((show) => ({
            id: show.id,
            title: show.title,
            showStart: new Date(show.showStart).toISOString().replace('T', ' ').slice(0, 23),
            showEnd: new Date(show.showEnd).toISOString().replace('T', ' ').slice(0, 23),
            image: show.image,
        }));

        const headers = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${user.token}`, // Lấy token từ context
            },
        };
        
        console.log('ShowTimes:', selectedShowTimesData);

        axios
            .post(`/content/${groupId}/content`, {
                userId: user.id, // ID của người dùng từ context
                movies: [], // Không gửi phim vì chỉ có showtimes
                showTimes: selectedShowTimesData, // Danh sách các showtime được chọn
            }, headers)
        
            .then((response) => {
                console.log('ShowTimes added:', response.data);
                alert('ShowTimes added successfully!');
            })
            .catch((error) => {
                const errorMessage = error.response?.data?.error || 'An error occurred!';
                alert(errorMessage);
                console.error(error);
            });
    };

    return (
        <div>
            <h4>Showtime</h4>
            <div className="movie-list-container">
                {showTime.map((item, index) => (
                    <div key={index} className="show-time-container">
                        <img
                            src={item.image}
                            alt={item.title}
                            className="show-image"
                        />
                        <div className="movie-title">{item.title}</div>
                        <div className="show-time">
                            Show time: {item.showStart} to {item.showEnd}
                        </div>

                        <input
                            type="checkbox"
                            checked={!!selectedShowTimes[item.id]}
                            onChange={() => handleCheckboxChangeShowTimes(item.id)}
                            className="showtime-checkbox"
                        />
                    </div>
                ))}
            </div>

            <button
                onClick={handleSubmitShowTimes}
                type="button"
                style={{ marginTop: '20px' }}
            >
                Submit Selected Showtimes to Group
            </button>
        </div>
    );
};

export default AddShowtime;