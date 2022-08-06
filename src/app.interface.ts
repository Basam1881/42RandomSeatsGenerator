export interface User {
    login: string
    usual_full_name:string
    location: string
    email: string
}


export interface ExamUser {
    id:                number;
    email:             string;
    login:             string;
    first_name:        string;
    last_name:         string;
    usual_full_name:   string;
    usual_first_name:  null;
    url:               string;
    phone:             string;
    displayname:       string;
    image_url:         string;
    new_image_url:     string;
    "staff?":          boolean;
    correction_point:  number;
    pool_month:        string;
    pool_year:         string;
    location:          null;
    wallet:            number;
    anonymize_date:    Date;
    data_erasure_date: Date;
    created_at:        Date;
    updated_at:        Date;
    alumnized_at:      null;
    "alumni?":         boolean;
}


export interface Exam {
    id: number
    ip_range: string
    begin_at: string
    end_at: string
    location: string
    max_people: any
    nbr_subscribers: number
    name: string
    created_at: string
    updated_at: string
    campus: Campus
    cursus: Cursu[]
    projects: Project[]
  }
  
  export interface Campus {
    id: number
    name: string
    time_zone: string
    language: Language
    users_count: number
    vogsphere_id: number
    country: string
    address: string
    zip: string
    city: string
    website: string
    facebook: string
    twitter: string
    active: boolean
    public: boolean
    email_extension: string
    default_hidden_phone: boolean
  }
  
  export interface Language {
    id: number
    name: string
    identifier: string
    created_at: string
    updated_at: string
  }
  
  export interface Cursu {
    id: number
    created_at: string
    name: string
    slug: string
    kind: string
  }
  
  export interface Project {
    id: number
    name: string
    slug: string
    parent: any
    children: any[]
    attachments: any[]
    created_at: string
    updated_at: string
    exam: boolean
    git_id: any
    repository: any
  }
  
