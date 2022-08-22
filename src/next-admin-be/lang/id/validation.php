<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Validation Language Lines
    |--------------------------------------------------------------------------
    |
    | The following language lines contain the default error messages used by
    | the validator class. Some of these rules have multiple versions such
    | as the size rules. Feel free to tweak each of these messages here.
    |
    */

    'accepted' => ':attribute harus diterima.',
    'accepted_if' => ':attribute harus diterima ketika :other adalah :value.',
    'active_url' => ':attribute bukanlah URL yang sah.',
    'after' => ':attribute haruslah tanggal setelah :date.',
    'after_or_equal' => ':attribute haruslah tanggal setelah atau sama dengan :date.',
    'alpha' => ':attribute hanya boleh berisi huruf.',
    'alpha_dash' => ':attribute hanya boleh berisi huruf, angka, tanda hubung dan garis bawah.',
    'alpha_num' => ':attribute hanya boleh berisi huruf dan angka.',
    'array' => ':attribute harus berupa susunan (array).',
    'before' => ':attribute haruslah tanggal sebelum :date.',
    'before_or_equal' => ':attribute haruslah tanggal sebelum atau sama dengan :date.',
    'between' => [
        'array' => ':attribute harus diantara :min dan :max item.',
        'file' => ':attribute harus diantara :min dan :max kilobyte.',
        'numeric' => ':attribute harus diantara :min dan :max.',
        'string' => ':attribute harus diantara :min dan :max karakter.',
    ],
    'boolean' => 'Isian :attribute harus bernilai benar atau salah.',
    'confirmed' => 'Konfirmasi :attribute tidak cocok.',
    'current_password' => 'Kata sandi salah.',
    'date' => ':attribute bukanlah tanggal yang sah.',
    'date_equals' => ':attribute haruslah tanggal yang sama dengan :date.',
    'date_format' => ':attribute tidak cocok dengan format :format.',
    'declined' => ':attribute harus ditolak.',
    'declined_if' => ':attribute harus ditolak ketika :other adalah :value.',
    'different' => ':attribute dan :other harus berbeda.',
    'digits' => ':attribute harus :digits digit.',
    'digits_between' => ':attribute harus diantara :min dan :max digit.',
    'dimensions' => ':attribute memiliki dimensi gambar yang salah.',
    'distinct' => 'Isian :attribute memiliki nilai duplikat.',
    'email' => 'Kolom :attribute harus berisi email yang sah.',
    'ends_with' => ':attribute harus diakhiri dengan salah satu seperti: :values.',
    'enum' => ':attribute yang dipilah salah.',
    'exists' => ':attribute yang dipilih salah.',
    'file' => ':attribute harus berupa berkas.',
    'filled' => 'Isian :attribute harus memiliki nilai.',
    'gt' => [
        'array' => ':attribute harus melebihi :value item.',
        'file' => ':attribute harus melebihi :value kilobyte.',
        'numeric' => ':attribute harus melebihi :value.',
        'string' => ':attribute harus melebihi :value karakter.',
    ],
    'gte' => [
        'array' => ':attribute harus memiliki :value item atau lebih.',
        'file' => ':attribute harus lebih besar atau sama dengan :value kilobyte.',
        'numeric' => ':attribute harus lebih besar atau sama dengan :value.',
        'string' => ':attribute harus lebih besar atau sama dengan :value karakter.',
    ],
    'image' => ':attribute harus berupa gambar.',
    'in' => ':attribute yang dipilih salah.',
    'in_array' => 'Isian :attribute tidak ada didalam :other.',
    'integer' => ':attribute harus berupa bilangan bulat.',
    'ip' => ':attribute harus berupa alamat IP yang sah.',
    'ipv4' => ':attribute harus berupa alamat IPV4 yang sah.',
    'ipv6' => ':attribute harus berupa alamat IPV6 yang sah.',
    'json' => ':attribute harus berupa rangkaian JSON yang sah.',
    'lt' => [
        'array' => ':attribute harus kurang dari :value item.',
        'file' => ':attribute harus kurang dari :value kilobyte.',
        'numeric' => ':attribute harus kurang dari :value.',
        'string' => ':attribute harus kurang dari :value karakter.',
    ],
    'lte' => [
        'array' => ':attribute tidak boleh melebihi :value item.',
        'file' => ':attribute harus kurang dari atau sama dengan :value kilobyte.',
        'numeric' => ':attribute harus kurang dari atau sama dengan :value.',
        'string' => ':attribute harus kurang dari atau sama dengan :value karakter.',
    ],
    'mac_address' => ':attribute harus berupa alamat MAC yang sah.',
    'max' => [
        'array' => ':attribute tidak boleh melebihi :max item.',
        'file' => ':attribute harus tidak boleh melebihi :max kilobyte.',
        'numeric' => ':attribute harus tidak boleh melebihi :max.',
        'string' => ':attribute harus tidak boleh melebihi :max karakter.',
    ],
    'mimes' => ':attribute harus berupa berkas dengan tipe: :values.',
    'mimetypes' => ':attribute harus berupa berkas dengan tipe: :values.',
    'min' => [
        'array' => ':attribute harus memiliki setidaknya :min item.',
        'file' => ':attribute harus setidaknya :min kilobyte',
        'numeric' => ':attribute harus setidaknya :min.',
        'string' => ':attribute harus setidaknya :min karakter.',
    ],
    'multiple_of' => ':attribute harus kelipatan dari :value.',
    'not_in' => ':attribute yang dipilih salah.',
    'not_regex' => 'Format :attribute salah.',
    'numeric' => ':attribute harus berupa angka.',
    'password' => [
        'letters' => ':attribute harus memiliki setidaknya satu huruf.',
        'mixed' => ':attribute harus mengandung setidaknya satu huruf besar dan satu huruf kecil.',
        'numbers' => ':attribute harus memiliki setidaknya satu angka.',
        'symbols' => ':attribute harus mengandung setidaknya satu simbol.',
        'uncompromised' => ':attribute yang diberikan muncul di kebocoran data. Mohon pilih :attribute yang berbeda.',
    ],
    'present' => 'Isian :attribute harus ada.',
    'prohibited' => 'Isian :attribute dilarang.',
    'prohibited_if' => 'Isian :attribute dilarang ketika :other adalah :value.',
    'prohibited_unless' => 'Isian :attribute dilarang kecuali :other ada didalam :values.',
    'prohibits' => 'Isian :attribute melarang :other untuk menjadi ada.',
    'regex' => 'Format :attribute salah.',
    'required' => 'Isian :attribute diperlukan.',
    'required_array_keys' => 'Isian :attribute harus berisi masukkan untuk: :values.',
    'required_if' => 'Isian :attribute diperlukan ketika :other adalah :value.',
    'required_unless' => 'Isian :attribute diperlukan kecuali :other ada didalam :values.',
    'required_with' => 'Isian :attribute diperlukan ketika :values is present.',
    'required_with_all' => 'Isian :attribute diperlukan ketika :values ada.',
    'required_without' => 'Isian :attribute diperlukan ketika :values tidak ada.',
    'required_without_all' => 'Isian :attribute diperlukan ketika tidak ada satu :values yang ada.',
    'same' => ':attribute dan :other harus sesuai.',
    'size' => [
        'array' => ':attribute harus berjumlah :size item.',
        'file' => ':attribute harus :size kilobyte.',
        'numeric' => ':attribute harus :size.',
        'string' => ':attribute harus :size karakter.',
    ],
    'starts_with' => ':attribute harus dimulai dengan salah satu seperti: :values.',
    'doesnt_start_with' => ':attribute tidak boleh dimulai dengan salah satu dari: :values.',
    'string' => ':attribute harus berupa rangkaian (string).',
    'timezone' => ':attribute harus berupa zona waktu yang sah.',
    'unique' => ':attribute sudah ada yang ambil.',
    'uploaded' => ':attribute gagal diunggah.',
    'url' => ':attribute harus berupa URL yang sah.',
    'uuid' => ':attribute harus berupa UUID yang sah.',

    /*
    |--------------------------------------------------------------------------
    | Custom Validation Language Lines
    |--------------------------------------------------------------------------
    |
    | Here you may specify custom validation messages for attributes using the
    | convention "attribute.rule" to name the lines. This makes it quick to
    | specify a specific custom language line for a given attribute rule.
    |
    */

    'custom' => [
        'attribute-name' => [
            'rule-name' => 'custom-message',
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Custom Validation Attributes
    |--------------------------------------------------------------------------
    |
    | The following language lines are used to swap our attribute placeholder
    | with something more reader friendly such as "E-Mail Address" instead
    | of "email". This simply helps us make our message more expressive.
    |
    */

    'attributes' => [
        'name' => 'Nama',
        'username' => 'Nama pengguna',
        'email' => 'Email',
        'password' => 'Kata sandi',
        'description' => 'Deskripsi',
        'privileges' => 'Hak Akses',
        'roles' => 'Peran',
        'users' => 'Pengguna',
        'label' => 'Label',
        'icon' => 'Ikon'
    ],

];
