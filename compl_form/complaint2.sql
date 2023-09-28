CREATE TABLE complaint2 (
    id INT(11) AUTO_INCREMENT PRIMARY KEY,
    dept VARCHAR(100) NOT NULL,
    year VARCHAR(20) NOT NULL,
    committee VARCHAR(100) NOT NULL,
    incdnt_dscrptin TEXT NOT NULL,
    indiv_inv VARCHAR(100) NOT NULL,
    date DATE NOT NULL,
    time TIME,
    location VARCHAR(255) NOT NULL,
    add_dtls TEXT,
    file_upload VARCHAR(255),
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    complaint_number VARCHAR(100) NOT NULL UNIQUE
);
